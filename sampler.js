count = 10000;

print("sampler will obtain samples of documents with differing schemas and save these to a database called 'sampler'");
print("Usage: mongo db --eval=\"databaseName='databaseName'; collectionName='collectionName'; count=num\" sampler.js");

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

function saveSampleDocument(document, toCollectionName) {
    db.getSiblingDB("sampler").getCollection(toCollectionName).insert(document);
}

SamplerSet = function(databaseAndCollectionName) {
    this.databaseAndCollectionName = databaseAndCollectionName;
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

var mySamplerSet = new SamplerSet(databaseName + "." + collectionName);

sample(databaseName, collectionName, Math.abs(count));

function sample(databaseName, collectionName, count) {
    var cursor = db.getSiblingDB(databaseName).getCollection(collectionName).find().limit(count);

    while (cursor.hasNext()) {
        var doc = cursor.next();
        mySamplerSet.push(doc);
    }
}