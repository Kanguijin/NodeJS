const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}));

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.wtvmcud.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    // 연결되면 할 일
    if(에러){return console.log(에러)}

    db = client.db('todoapp');

    // db.collection('post').insertOne( {이름 : 'john', _id : 100} , function(에러, 결과){
    //     console.log('저장완료');
    // });

    app.listen(8080, function(){
        console.log('listening on 8080');
    });

})


// 누군가 /pet으로 방문을 하면 .. pet관련된 안내문을 띄워주자

app.get('/pet', (요청, 응답) => {
    응답.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function(요청, 응답){
    응답.send('뷰티용품 사세요');
});

app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html');
});
app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html');
});

// 어떤 사람이 /add 경로로 POST요청을 하면...
// ?? 를 해주세요~

app.post('/add', function (요청, 응답) {
    응답.send('전송완료');
    db.collection('counter').findOne( {name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost);
        var 총게시물갯수 = 결과.totalPost;
        db.collection('post').insertOne({_id : 총게시물갯수 + 1 ,제목 : 요청.body.title, 날짜 : 요청.body.date}, function(에러, 결과){
            console.log('저장완료');
            // counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정)
            db.collection('counter').updateOne({name : '게시물갯수'}, { $inc : {totalPost : 1} }, function(에러, 결과){
                if(에러){return console.log(에러)}
            });
        })
    } );
});



// /list 로 GET요청으로 접속하면
// 실제 DB에 저장된 데이터들로 예쁘게 꾸며진 HTML을 보여줌. 

app.get('/list', function(요청, 응답){
    // 디비에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러, 결과){
        // 데이터 다 가져오기
        console.log(결과);
        응답.render('list.ejs', { posts : 결과 });
    });

});





