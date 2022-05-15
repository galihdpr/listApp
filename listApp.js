const express = require('express');
const mysql = require('mysql2'); //ubah dari mysql menjadi mysql2
const app = express();
const PORT = process.env.PORT || 3000;

//connect the asset and css
app.use(express.static('public'));

//Get value input from the form 
app.use(express.urlencoded({extended:false}));

//connect to database
const connection = mysql.createConnection({
    host : 'localhost', //ini harus localhost jika menggunakan local development
    user : 'galihdev',
    password : 'ep@unair14',
    database : 'manepodb' 
});
//display the index page
app.get('/', (req, res) => {
    connection.query(
        'SELECT * FROM po_list',
        (error, results) => {
            res.render('index.ejs',{listpo : results});
        }
    );
});

//display the create page
app.get('/create', (req, res) =>{
    res.render('create.ejs');
});

//Add route method for creating item
app.post('/new', (req,res) =>{
    //insert value from form into database po_list
    connection.query(
        'INSERT INTO po_list(agreement_no, nama, cmo, dealer, tgl_cetak_po, status_po, tanggal_ambil, keterangan) VALUES (?,?,?,?,?,?,?,?)',
        [[req.body.agreement],[req.body.nama],[req.body.cmo],[req.body.dealer],[req.body.tgl_cetak_po],
        [req.body.status],[req.body.tanggal_ambil],[req.body.keterangan]],
        (error, results) =>{
            res.redirect('/');
        }
    );
});    


//Add route for deleting items
app.post('/delete/:no',(req,res)=>{
    connection.query(
        'DELETE FROM po_list WHERE no = ?',
        [req.params.no],
        (error,results) =>{
            res.redirect('/');
        }
    );
});

//Add route for edit items, pada project ini
app.get('/edit/:no',(req,res) =>{
    connection.query(
        'SELECT * FROM po_list where no = ?',
        [req.params.no],
        (error,results) =>{
            console.log(results);
            res.render('edit.ejs',{item : results[0]});
        }
    );
});

// set route to update date
app.post('/update/:no',(req,res)=>{
    connection.query(
        'UPDATE po_list SET agreement_no = ?, nama = ?, cmo = ?, dealer = ?, tgl_cetak_po = ?, status_po = ?, tanggal_ambil = ?, keterangan = ? WHERE no = ?',
        [[req.body.agreement],[req.body.nama],[req.body.cmo],[req.body.dealer],[req.body.tgl_cetak_po],
        [req.body.status],[req.body.tanggal_ambil],[req.body.keterangan], [req.params.no]],
        (error, results) => {
            res.redirect('/');
        }
    );
});

app.listen(PORT);