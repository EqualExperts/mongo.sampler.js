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

SamplerSet = function() {
    this.documentSchemaProperties = [];
    this.uniqueSchemaDocuments = [];
};

SamplerSet.prototype.push = function(doc) {
    var docProperties = getProperties(doc);

    var doesNotHaveProperties = false;
    var notAddedDocument = true;
    for (prop in docProperties) {
        doesNotHaveProperties = (this.documentSchemaProperties.indexOf(prop) == -1);
        if (doesNotHaveProperties) {
            this.documentSchemaProperties.push(prop); //Update the list of properties

            if (notAddedDocument) {
                this.uniqueSchemaDocuments.push(doc); //Accumulate the document as having some schema differences
                notAddedDocument = false;
            }
        }
    }
}

SamplerSet.prototype.printSamples = function() {
    this.uniqueSchemaDocuments.forEach(printjson);
}

var mySamplerSet = new SamplerSet();

sample(databaseName, collectionName, Math.abs(count));
mySamplerSet.printSamples();

function sample(databaseName, collectionName, count) {
    var cursor = db.getSiblingDB(databaseName).getCollection(collectionName).find().limit(count);

    while (cursor.hasNext()) {
        var doc = cursor.next();
        mySamplerSet.push(doc);
    }
}