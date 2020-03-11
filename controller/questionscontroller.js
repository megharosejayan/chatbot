module.exports=function(app){
    app.get('/questions', function (req, res) {
        res.render('addQuestion')
    })
    
    app.post('/questions/add', function (req, res) {
        console.log(req.body);
        var body =req.body;
         res.send(req.body);
    })
    
};