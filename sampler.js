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

SamplerSet = function() {
    this.uniqueSchemaDocuments = [];
};

SamplerSet.prototype.push = function(doc) {
    this.uniqueSchemaDocuments.push(doc);
}

SamplerSet.prototype.printSamples = function() {
    print(this.uniqueSchemaDocuments);
}

var mySamplerSet = new SamplerSet();

sample(databaseName, collectionName, Math.abs(count));
mySamplerSet.printSamples();

function sample(databaseName, collectionName, count) {
    var cursor = db.getSiblingDB(databaseName).getCollection(collectionName).find().limit(count);

    while (cursor.hasNext()) {
        var doc = cursor.next();
        mySamplerSet.push(getProperties(doc));
    }
}

function getProperties(forDocument) {
    var propertiesList = [];
    for (prop in forDocument) {
        propertiesList.push(prop);
    }
    return propertiesList;
}