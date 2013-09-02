Run sampler on your mongo database and it will find one of each kind of document in a collection.

Run it as a script supplied to your mongo client as:
<pre>
$ mongo db --eval="db='databaseName'; collection='collectionName'; count=num" sampler.js
</pre>

Note that a difference in schema can be one or more of the following:
* a difference in properties
* a different in the types of values for the same properties

(As of now, we are only comparing the properties...)

You can specify a limit in terms of the number of documents it will look through,
(so it does not run forever on a large collection, for example)

sampler will copy these documents over to a database called 'sampler' into a collection named as 'x.y',
where x is the database name, and y is the collection name.
It will clear out this collection in 'sampler' before each run.

#TODO
Run sampler from your mongo prompt as:
<pre>
$ mongo
MongoDB shell version: 2.4.1
connecting to: test
> sample(databaseName, collectionName, [countOfDocuments])

</pre>

!!! NOTE !!!
sampler will not write to any database other than one called 'sampler'.

END-OF-FILE
