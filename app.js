var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;
var app = express();

app.set('views',path.join(__dirname,'view'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j','123456'));
var session = driver.session();

//dk 10
/* app.get('/',function(red, res){
    session
    .run('MATCH (n:Movie) RETURN n,count(*)')
    .then(function(result){
        var moviesay = [];
        result.records.forEach(function(record){
            moviesay.push({
                id: record._fields[0].identity.low,
                title: record._fields[0].properties.title
            });
        });
    })
    .catch(function(err){
        console.log(err)
    })

}); */

app.get('/',function(red, res){
    session
        .run('MATCH(n:Movie) RETURN n LIMIT 25')
        .then(function(result){
            var movieArr = [];
            result.records.forEach(function(record){
                movieArr.push({
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.title,
                    year:record._fields[0].properties.year,
                    imdb:record._fields[0].properties.imdb,
                    about:record._fields[0].properties.about
                });
            });
            session
                .run('MATCH(n:Actor) RETURN n LIMIT 25')
                .then(function(result2){
                    var actorArr = [];
                    result2.records.forEach(function(record){
                        actorArr.push({
                            id: record._fields[0].identity.low,
                            name: record._fields[0].properties.name,
                            age: record._fields[0].properties.age,
                            birthplace: record._fields[0].properties.birthplace
                        });
                    });
                      
                    session
                    .run('MATCH(n:Yonetmen) RETURN n LIMIT 25')
                    .then(function(result){
                        var yonetmenArr = [];
                        result.records.forEach(function(record){
                            yonetmenArr.push({
                                id: record._fields[0].identity.low,
                                name: record._fields[0].properties.name, 
                                age: record._fields[0].properties.age,
                                birthplace: record._fields[0].properties.birthplace,
                                about:record._fields[0].properties.about

                            });
                            
                        });
                        res.render('index',{
                            Movie: movieArr,
                            Actor: actorArr,
                            Yonetmen: yonetmenArr
                        })
                    })
                    .catch(function(err){
                        console.log(err);
                    });
                     
                   /* res.render('index', {
                        
                    }); */
                })
                .catch(function(err){
                    console.log(err);
                });
        })
        .catch(function(err){
            console.log(err)
        })   
});

 



/* SİLME İSLEMİ */
app.post('/Movie/sil',function(req, res){
    var title = req.body.title;
    

    session 
        .run('MATCH (n:Movie {title:{titleParam}}) DETACH DELETE n',{titleParam:title})
 
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});
app.post('/Actor/sil',function(req, res){
    var name = req.body.name;;
    

    session 
        .run('MATCH (n:Actor {name:{nameParam}}) DETACH DELETE n',{nameParam:name})
        
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});
/* SİLME İŞLEMİ */

app.post('/Movie/guncelle',function(req, res){
    var title = req.body.title;
    var title = req.body.title2;
     
    //var title = req.body.title;
 

    session
    //MATCH (n { name: 'Andy' }) SET n.surname = 'Taylor' RETURN n.name, n.surname
    //'MATCH (n {n:Movie {title:{titleParam}}}) SET n.title= {title2Param} RETURN n.title'
    .run('MATCH (n:Movie {title: $title}}) SET n.title= $title2 RETURN n',
    {title: req.body.title, title2: req.body.title2})
        // .run('CREATE(n:Movie {title:{titleParam},year:{yearParam}}) RETURN n.title',{titleParam:title, title2Param:title})
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});

app.post('/Actor/add',function(req, res){
    var name = req.body.name;
    var age = req.body.age;
    var birthplace = req.body.birthplace;
    var about = req.body.about;
    
    session
        .run('CREATE(n:Actor {name:{nameParam},age:{ageParam},birthplace:{birthplaceParam},about:{aboutParam}}) RETURN n.name',{nameParam:name, ageParam:age, birthplaceParam:birthplace,aboutParam:about})
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');

});

//film  ekleme
app.post('/Movie/add',function(req, res){
    var title = req.body.title;
    var year = req.body.year;
    var imdb = req.body.imdb;
    var language = req.body.language;
    var about = req.body.about;

    session
        .run('CREATE(n:Movie {title:{titleParam},year:{yearParam},imdb:{imdbParam},language:{languageParam},about:{aboutParam}}) RETURN n.title',
        {titleParam:title, yearParam:year, imdbParam:imdb, languageParam:language, aboutParam:about})
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});
//film  ekleme
//yonetmen ekleme
app.post('/yonetmen/add',function(req, res){
    var name = req.body.name;
    var age = req.body.age;
    var birthplace = req.body.birthplace;
 
    var about = req.body.about;
 
    session
    .run('CREATE(n:Yonetmen {name:{nameParam},age:{ageParam},birthplace:{birthplaceParam},about:{aboutParam}}) RETURN n.title',
    {nameParam:name, ageParam:age, birthplaceParam:birthplace, aboutParam:about})
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');

});
//yonetmen ekleme
app.post('/type/add',function(req, res){
    var name = req.body.name;
 
    session
        .run('CREATE(n:Type {name:{nameParam}}) RETURN n.name',{nameParam:name})
        .then(function(result){
            res.redirect('/');
            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');

});

app.post('/Movie/Actor/add',function(req, res){
    var title = req.body.title;
    var name = req.body.name;

    session
        .run('MATCH(a:Actor {name:{nameParam}}),(b:Movie{title:{titleParam}}) MERGE(a)-[r:Oyuncusu]-(b) RETURN a,b',{titleParam: title,nameParam:name})
        .then(function(result){
            res.redirect('/');

            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});

//tür film iliskisi
app.post('/Type/Movie/add',function(req, res){
    var title = req.body.title;
    var name = req.body.name;

    session
        .run('MATCH(a:Movie {title:{titleParam}}),(b:Type{name:{nameParam}}) MERGE(a)-[r:Katagori]-(b) RETURN a,b',{nameParam:name,titleParam: title})
        .then(function(result){
            res.redirect('/');

            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});
//tür film iliskisi
//film yonetmen iliskisi
app.post('/yonetmen/Movie/add',function(req, res){
    var title = req.body.title;
    var name = req.body.name;

    session
        .run('MATCH(a:Movie {title:{titleParam}}),(b:Yonetmen{name:{nameParam}}) MERGE(b)-[r:Yonetir]-(a) RETURN a,b',{nameParam:name,titleParam: title})
        .then(function(result){
            res.redirect('/');

            session.close();
        })
        .catch(function(err){
            console.log(err);
        });
    res.redirect('/');
});
//film yonetmen iliskisi

//oyuncu yonetmen iliskisi***************

//oyuncu yonetmen iliskisi

app.listen(3000);
console.log('Server Started on Port 3000');
module.exports = app;