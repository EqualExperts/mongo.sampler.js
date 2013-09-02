DEFAULT_COUNT = 10000;

print("sampler will obtain samples of documents with differing schemas and save these to a database called 'sampler'");
print("Usage: mongo db --eval=\"databaseName='databaseName'; collectionName='collectionName'; count=num\" sampler.js\n");

if (!databaseName) {
    print("Please specify a database name to sample");
    return;
}

if (!collectionName) {
    print("Please specify a collection name to sample from database " + databaseName);
    return;
}

function getProperties(forDocument) {
    var propertiesList = [];
    for (prop in forDocument) {
        propertiesList.push(prop);
    }
    return propertiesList;
}

function cleanUpSamples(fromCollectionName) {
    db.getSiblingDB("sampler").getCollection(fromCollectionName).remove({});
}

function saveSampleDocument(document, toCollectionName) {
    db.getSiblingDB("sampler").getCollection(toCollectionName).insert(document);
}

SamplerSet = function(databaseAndCollectionName) {
    this.databaseAndCollectionName = databaseAndCollectionName;
    cleanUpSamples(databaseAndCollectionName);

    this.documentSchemaProperties = [];
};

SamplerSet.prototype.push = function(doc) {
    var docProperties = getProperties(doc);

    var doesNotHaveProperties = false;
    var notSavedSampleDocument = true;
    for (prop in docProperties) {
        doesNotHaveProperties = (this.documentSchemaProperties.indexOf(prop) == -1);
        if (doesNotHaveProperties) {
            this.documentSchemaProperties.push(prop); //Update the list of properties

            if (notSavedSampleDocument) {
                saveSampleDocument(doc, this.databaseAndCollectionName); //Save the document as a sample
                notSavedSampleDocument = false;
            }
        }
    }
}

var countLimit = count || DEFAULT_COUNT;
countLimit = Math.abs(countLimit);

print("Sampling upto " + countLimit + " documents from " + databaseName + " and collection " + collectionName);

var mySamplerSet = new SamplerSet(databaseName + "." + collectionName);

sample(databaseName, collectionName, countLimit);

function sample(databaseName, collectionName, count) {
    var cursor = db.getSiblingDB(databaseName).getCollection(collectionName).find().limit(count);

    while (cursor.hasNext()) {
        var doc = cursor.next();
        mySamplerSet.push(doc);
    }
}