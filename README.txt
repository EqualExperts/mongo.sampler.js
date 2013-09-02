Run sampler on your mongo database and it will find one of each kind of document.

You can specify a limit in terms of the number of documents it will look through, (so it does not run forever on a large collection, for example)
sampler will copy these documents over to a database called 'sampler' into a collection named as 'x.y',
where x is the database name, and y is the collection name.

Run sampler from your mongo prompt as:
mongo> sample(databaseName, collectionName, [countOfDocuments])

Otherwise, run it as a script supplied to your mongo client as:
$ mongo db --eval="db='databaseName'; collection='collectionName'; count=num" sampler.js

!!! NOTE !!!
sampler will not write to any database other than one called 'sampler'.

END-OF-FILE
