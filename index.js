const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const pool = require('./data/config');

var bodyParser = require('body-parser');
const { response } = require('express');


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 app.get('/api/users',(request, response)=>{
    pool.query('SELECT * FROM employee_master',(err,result)=>{
        if(err) throw err;
        response.send(result);
    });
}); 

app.put("/api/users/update/:emp_code", (req , res)=>{
    var postData  = req.body;
    console.log(postData);
    pool.query('UPDATE employee_master SET ? WHERE emp_code',postData,(err,result)=>{
        if(err) throw err;
        console.log("row updated");
        response.send(result);
    });
});




//Manual Entry
//Employee crud operation
app.get('/manualentry/employee',(request, response)=>{
    pool.query('SELECT me.id,e.emp_code,me.item_count,me.code,me.id, me.canteen_type, me.item_id,me.category_id,c.category_name, e.emp_name,me.date,me.status FROM `manual_entry` me JOIN employee_master e ON e.emp_code = me.emp_code    JOIN category_master c ON c.id = me.category_id',(err,result)=>{
        if(err) throw err;
        response.send(result);
    });
});
app.get('/manualentry/manualentryemp/:empcode',(request, response)=>{
    var emp_code = request.params.empcode;
    //console.log(emp_code);
    pool.query("SELECT em.emp_name, em.category_id,cm.category_name FROM employee_master as em INNER JOIN category_master cm ON em.category_id=cm.id where em.emp_code= ?",emp_code,(err,result)=>{
        if(err) throw err;
        response.send(result);
    });
});
app.get('/manualentry/employee/item',(request, response)=>{
    var postData = request.body
    pool.query("select item_id,item_name from item_master",postData,(err,result)=>{
        if(err) throw err;
        response.send(result);
    });
});
app.get('/manualentry/employee/category',(request, response)=>{
    var postData = request.body
    pool.query("select id,category_name from category_master",postData,(err,result)=>{
        if(err) throw err;
        response.send(result);
    });
});
app.post('/manualentry/manualentrynew',(request, response)=>{
    var  empEntryDtata  = request.body;
    var empEntyLength   = empEntryDtata.length;
    for(i=0;i<empEntyLength;i++) {
        pool.query("insert into  manual_entry SET ?",empEntryDtata[i],(err,result)=>{
            if(err) throw err;
            response.end(JSON.stringify(result));
        });
    }
    console.log(empEntryDtata);
       
 });

 app.put('/manualentry/employeeedit/:id',(request, response)=>{
    var empEntryDtata  = request.body;
    console.log(empEntryDtata);
        pool.query("UPDATE manual_entry SET ? WHERE id",empEntryDtata,(err,result)=>{
            if(err) throw err;
            response.end(JSON.stringify(result));
        });
    console.log(empEntryDtata);
       
 });

 app.delete('/manualentry/employeedelete/:id',(request, response)=>{
    var id = request.params.id;
    pool.query("delete from manual_entry where id= ?",id,(err,result)=>{
        if(err) throw err;
        response.send(result);
    });
});


//Contractor crud operation
app.get('/manualentry/contractor/users',(request, response)=>{
    pool.query('SELECT me.id,e.emp_code,me.item_count,me.code,me.id, me.canteen_type, me.item_id, c.category_name, e.emp_name,me.date,me.status FROM `guest_manual_entry` me JOIN employee_master e ON e.emp_code = me.emp_code    JOIN category_master c ON c.id = me.category_id',(err,result)=>{
        if(err) throw err;
        response.send(result);
    });

});







app.listen(port,()=>{ console.log(`server connected...${port}`); });

