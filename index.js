const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
const pool = require('./data/config');

var bodyParser = require('body-parser');
const { response, request } = require('express');


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
        //console.log(postData);
        pool.query('UPDATE employee_master SET ? WHERE emp_code',postData,(err,result)=>{
            if(err) throw err;
            console.log("row updated");
            response.send(result);
        });
    });
   
//Employee 
    app.get('/barcode/view/:empcode',(request, response)=>{
        var empcode = request.params.empcode;
        //console.log(itemId);
        pool.query("select * from employee_master where emp_code = ?",[empcode],(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });    

//Canteen Menu
    //canteen Time
    app.get('/canteenmenu/cateentime/view',(request, response)=>{
        pool.query("select * from canteen",(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    app.put("/canteenmenu/cateentime/:id", (request , response)=>{
        var id = request.params.id;
        //console.log(id);
        var postData  = request.body;
        //console.log(postData);
        for(i=0;i<1;i++){
            var start_time = postData[0].start_time;
            var end_time   = postData[0].end_time;
            //console.log(start_time);
            //console.log(end_time);
        }
        pool.query('UPDATE canteen SET start_time = ?,end_time = ? WHERE id = ?',[start_time,end_time,id],(err,result)=>{
            if(err) throw err;
            console.log("Number of records updated: " + result.affectedRows);
            response.send(result);
        });
    });
    //Weekly Item Config
    app.get('/canteenmenu/weeklyitemconfig/view/:id',(request, response)=>{
        var id = request.params.id;
        if(id == 1)
        {
            var table = "weekly_menu_1";
            //console.log(table);
        }
        else if(id == 2)
        {
            var table = "weekly_menu_2";
            //console.log(table);
        }
        else if(id == 3){
            var table = "weekly_menu_3";
            //console.log(table);
        }
        else if (id == 4){
            var table = "weekly_menu_4";
            //console.log(table);
        }else {
            //console.log("Id Does Not exsist");
        }

        pool.query("select * from "+table,(err,result)=>{
            if(err) throw err;
            response.send(result);
            return (table);
        });
    });
    app.post("/canteenmenu/weeklyitemconfig/excelsave/:id",(request,response)=>{
        var id = request.params.id;
        console.log(id);
        var postData = request.body;
        console.log(postData);

        pool.query("insert table",(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    app.put("/canteenmenu/weeklyitemconfig/update/:id",(request,response)=>{
        var id      = request.params.id;
        var data    = request.body;
        
        pool.query("update table weekly_menu_1 SET ? where id = ?",[data,id],(err,result)=>{
            if(err) throw err;
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
        var postData = request.body;
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
    app.get('/manualentry/employee/getsaveditem/:item_id',(request, response)=>{
        var item_id = request.params.item_id;
        console.log(item_id);
        pool.query(`SELECT * FROM item_master where item_id in (${item_id})`,item_id,(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    app.post('/manualentry/manualentrynew',(req, res)=>{
        var empEntryDtata = req.body;
        //console.log(empEntryDtata);
        for(i=0;i<=1;i++){
        var item_id         =  empEntryDtata[0].item_id;
        var item_count      =  empEntryDtata[0].item_count;
        var code            =  empEntryDtata[1].code;
        var canteen_type    =  empEntryDtata[1].canteen_type;
        var emp_code        =  empEntryDtata[1].emp_code;
        var date            =  empEntryDtata[1]. date;
        }
        //console.log(item_id);
        //console.log(item_count);
        //console.log(code);
            pool.query("Insert into manual_entry (item_id,item_count,code,canteen_type,emp_code,date) values (?,?,?,?,?,?)",[item_id,item_count,code,canteen_type,emp_code,date],(err,result)=>{
                if(err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
                res.end(JSON.stringify(result));
            });   
    });

    app.put('/manualentry/employeeedit/:id',(request, response)=>{
        var idValue = request.params.id;
        //console.log(idValue);
        var empEntryDtata  = request.body;
        //console.log(empEntryDtata);
        if(empEntryDtata == 0) {
         console.log("Empty Records");
        }else {
            for(i=0;i<=1;i++){
                var item_id       =   empEntryDtata[0].item_id;
                var item_count    =   empEntryDtata[0].item_count;
                var code          =   empEntryDtata[1].code;
                var canteen_type  =   empEntryDtata[1].canteen_type;
                var category_id   =   empEntryDtata[1].category_id;
              }
        }               
        //console.log(item_id);
        //console.log(code);
            pool.query("UPDATE `manual_entry` SET item_id = ?,item_count = ?,code = ?,canteen_type = ?,category_id = ? WHERE id = ?",[item_id,item_count,code,canteen_type,category_id,idValue],(err,result)=>{
                if(err) throw err;
                console.log("Number of records updated: " + result.affectedRows);
                response.end(JSON.stringify(result));
            });        
    });

    app.delete('/manualentry/employeedelete/:id',(request, response)=>{
        var id = request.params.id;
        pool.query("delete from manual_entry where id= ?",id,(err,result)=>{
            if(err) throw err;
            response.end(JSON.stringify(result));
        });
    });


    //Contractor crud operation
    app.get('/manualentry/contractor/users',(request, response)=>{
        pool.query('SELECT me.id,e.emp_code,me.item_count,me.code,me.id, me.canteen_type, me.item_id, c.category_name, e.emp_name,me.date,me.status FROM `guest_manual_entry` me JOIN employee_master e ON e.emp_code = me.emp_code    JOIN category_master c ON c.id = me.category_id',(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    //update
    app.put('/manualentry/contractor/contedit/:id',(request, response)=>{
        var contIdValue = request.params.id;
        //console.log(contIdValue);
        var contEntryDtata  = request.body;
       // console.log(contEntryDtata);
        for(i=0;i<=1;i++){
            var item_id       =   contEntryDtata[0].item_id;
            var item_count    =   contEntryDtata[0].item_count;
            var code          =   contEntryDtata[1].code;
            var canteen_type  =   contEntryDtata[1].canteen_type;
            var category_id   =   contEntryDtata[1].category_id;
          }
          pool.query("UPDATE `manual_entry` SET item_id = ?,item_count = ?,code = ?,canteen_type = ?,category_id = ? WHERE id = ?",[item_id,item_count,code,canteen_type,category_id,contIdValue],(err,result)=>{
            if(err) throw err;
            console.log("Number of records updated: " + result.affectedRows);
            response.end(JSON.stringify(result));
        }); 
    });
    //delete
    app.delete('/manualentry/contractor/contdelete/:id',(request, response)=>{
        var id = request.params.id;
        pool.query("delete from manual_entry where id= ?",id,(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });


//Meeting Request
    //read
    app.get('/manualentry/meetingreq/view',(request, response)=>{
        pool.query('SELECT * from meeting_header',(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    app.get('/manualentry/meetingreq/itemview',(request, response)=>{
        pool.query('SELECT * from item_master where item_id in (1,2,3,4,10,11,12,13,14)',(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    app.get('/manualentry/meetingreq/editItemView/:itemid',(request, response)=>{
        var itemId = request.params.itemid;
        console.log(itemId);
        pool.query("SELECT item_name FROM `item_master` where item_id in(select item_id from meeting_detail where meeting_header_code= ?)",[itemId],(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    app.get('/manualentry/meetingreq/editItemQuantityView/:itemid',(request, response)=>{
        var itemId = request.params.itemid;
        //console.log(itemId);
        pool.query("SELECT quantity FROM `meeting_detail` where meeting_header_code = ?",[itemId],(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
    //save
    app.post('/manualentry/meetingreq/save',(request, response)=>{
        var meetingReqDtata = request.body;
        var meetingLength   = meetingReqDtata.length;
        //console.log("length--->",meetingLength);
        var formData         =   meetingReqDtata.slice(-1)[0];
        var code             =   formData.code;
        var emp_code         =   formData.emp_code;
        var department_id    =   formData.department_id;
        var date             =   formData.date;
        var no_of_persons    =   formData.no_of_persons;
        var remarks          =   formData.remarks;
        var meeting_room     =   formData.meeting_room;
        //console.log(code);
        //console.log(emp_code);

        pool.query("insert into  meeting_header (code,emp_code,department_id,date,no_of_persons,remarks,meeting_room) values (?,?,?,?,?,?,?)",[code,emp_code,department_id,date,no_of_persons,remarks,meeting_room],(err,result)=>{
            if(err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            response.end(JSON.stringify(result));
        }); 

       for(j=0;j<meetingLength-1;j++){
            var item_id     = meetingReqDtata[j].item_id;
            var quantity    = meetingReqDtata[j].number;
            //console.log("id-->",item_id);
            //console.log("qty-->",quantity);
            pool.query("insert into  meeting_detail (meeting_header_code,item_id,quantity) values (?,?,?)",[code,item_id,quantity],(err,result)=>{
                if(err) throw err;
                console.log("Number of records inserted: " + result.affectedRows);
                response.end(JSON.stringify(result));
            });
        } 
    });
    //update
    app.put('/manualentry/meetingreq/edit',(request, response)=>{
        var meetingReqDtata = request.body;
        var meetingLength   = meetingReqDtata.length;
        //console.log("length--->",meetingLength);
        var formData         =   meetingReqDtata.slice(-1)[0];
        var code             =   formData.code;
        var emp_code         =   formData.emp_code;
        var department_id    =   formData.department_id;
        var date             =   formData.date;
        var no_of_persons    =   formData.no_of_persons;
        var remarks          =   formData.remarks;
        //var meeting_room     =   formData.meeting_room;
        //console.log(code);
        //console.log(emp_code);

        pool.query("update meeting_header SET department_id = ?,date = ?,no_of_persons = ?,remarks = ? where emp_code = ?",[department_id,date,no_of_persons,remarks,emp_code],(err,result)=>{
            if(err) throw err;
            console.log("Number of records Updated: " + result.affectedRows);
            response.end(JSON.stringify(result));
        }); 

    for(j=0;j<meetingLength-1;j++){
            var item_id     = meetingReqDtata[j].item_id;
            var quantity    = meetingReqDtata[j].number;
            //console.log("id-->",item_id);
            //console.log("qty-->",quantity);
            pool.query("update  meeting_detail SET meeting_header_code = ?,item_id = ?,quantity = ? where meeting_header_code = ?",[code,item_id,quantity,code],(err,result)=>{
                if(err) throw err;
                console.log("Number of records Updated: " + result.affectedRows);
                response.end(JSON.stringify(result));
            });
        } 
    });


//Barcode
    app.get('/barcode/view/:itemid',(request, response)=>{
        var itemId = request.params.itemid;
        //console.log(itemId);
        pool.query("select * from employee_master where emp_code = ?",[itemId],(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });
//REports
    //Summary
    app.post('/report/summaryview',(request, response)=>{
        var postData    = request.body;
        //console.log(postData);
        var fromdate    =  postData[0].from_date;
        var todate      =  postData[0].to_date;
        var id          =  postData[0].id;
        var company_id  =  postData[0].company_id;
        var dept_id     =  postData[0].dept_id;
        //console.log(fromdate);
        //console.log(todate);
        console.log(id);
        console.log(company_id);
        console.log(dept_id);

        pool.query("(SELECT i.item_id,im.item_name,sum(quanty) as qty,uom,CONVERT(r.company_amount,DECIMAL(10,2)) as company_amount,CONVERT((sum(quanty)*r.company_amount),DECIMAL(10,2))as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and ? between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id!=43 or i.item_id!=44) and reports_show=1 and date(i.date) between ? and ? and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name) union (SELECT i.item_id,im.item_name,sum(no_of_person) as qty,uom,CONVERT(r.company_amount,DECIMAL(10,2)) as  company_amount,CONVERT((sum(no_of_person)*r.company_amount),DECIMAL(10,2)) as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and ? between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id=43 or i.item_id=44) and reports_show=1 and date(i.date) between ? and ? and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or  (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name)",[fromdate,fromdate,todate,fromdate,fromdate,todate],(err,result)=>{
            if(err) throw err;
            response.send(result);
        });
    });

app.listen(port,()=>{ console.log(`server connected...${port}`); });

