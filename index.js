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
   /*  app.post('/report/summaryview',(request, response)=>{
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
    }); */
     //summaryview

     app.get('/report/summaryview',(request, response)=>{
        //var itemId = request.params.itemid;
        var fromdate='2016-04-04';
        var todate='2020-12-04';
        
        //console.log(itemId);
        // var x="(SELECT i.item_id,im.item_name,sum(quanty) as qty,CONVERT(r.company_amount,DECIMAL(10,2)) as company_amount,CONVERT((sum(quanty)*r.company_amount),DECIMAL(10,2))as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and '2017-06-04' between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id!=43 or i.item_id!=44) and reports_show=1 and date(i.date) between '2017-06-04' and '2017-08-04' and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name) union (SELECT i.item_id,im.item_name,sum(no_of_person) as qty,CONVERT(r.company_amount,DECIMAL(10,2)) as  company_amount,CONVERT((sum(no_of_person)*r.company_amount),DECIMAL(10,2)) as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and '2017-06-04' between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id=43 or i.item_id=44) and reports_show=1 and date(i.date) between '2017-06-04' and '2017-08-04' and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or  (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name)";
         
        pool.query("(SELECT i.item_id as item,im.item_name,sum(quanty) as qty,uom,CONVERT(r.company_amount,DECIMAL(10,2)) as company_amount,CONVERT((sum(quanty)*r.company_amount),DECIMAL(10,2))as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and ? between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id!=43 or i.item_id!=44) and reports_show=1 and date(i.date) between ? and ? and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name) union (SELECT i.item_id,im.item_name,sum(no_of_person) as qty,uom,CONVERT(r.company_amount,DECIMAL(10,2)) as  company_amount,CONVERT((sum(no_of_person)*r.company_amount),DECIMAL(10,2)) as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and ? between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id=43 or i.item_id=44) and reports_show=1 and date(i.date) between ? and ? and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or  (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name)",[fromdate,fromdate,todate,fromdate,fromdate,todate],(err,result)=>{
            if(err) throw err;
            //response.send(result);
            var data=result;  
            var length=data.length;
            //console.log(item);
            //var data1=[];
            //data1.push(data);
            //console.log(data1);
            for(i=0;i<length;i++){
                var item_id = data[i].item;
                //console.log(item_id);
                if(item_id==43 || item_id==44)
                {
                    var sum="no_of_person";
                    
                }
                else
                {
                    var sum="quanty";
                
                } 

            }

                        pool.query(` (SELECT cm.category_name,sum(h.${sum}) as qty  FROM invoice_header h join category_master cm on cm.id=h.category_id WHERE date(h.date) between ? and ? and h.item_id=? and h.category_id<>6 and h.category_id<>14 and h.category_id<>2 group by cm.category_name)
                        union
                        (SELECT  case when cc.payable_by='ial' then 'Service Provider' else 'Payable BY SP' end as ttt, sum(h.${sum}) as qty FROM invoice_header h join employee_master m on m.emp_code=h.emp_code
                        join company_master cc on cc.id=m.company  WHERE date(h.date) between ? and ? and h.item_id=? and h.category_id=2 and cc.payable_by='ial'
                        group by ttt)`,[fromdate,todate,item_id,fromdate,todate,item_id],(err,result1)=>{
                            if(err) throw err;
                            
                        //response.send(result1); 
                        var res1=result1;  
                        var res=result;
                        var finalresult=[];
                finalresult.push(res1,res);
                response.send(finalresult);
                }); 
            
                //console.log(finalresult);
                
                });


            });
            //employeeview
            app.get('/report/employeeview',(request, response)=>{
                var from_date='2016-04-01';
                    var to_date='2020-12-09';
                    var category="1";
                    var department="1";
                    var company="all";
                    
                    //console.log(itemId);
                    // var x="(SELECT i.item_id,im.item_name,sum(quanty) as qty,CONVERT(r.company_amount,DECIMAL(10,2)) as company_amount,CONVERT((sum(quanty)*r.company_amount),DECIMAL(10,2))as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and '2017-06-04' between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id!=43 or i.item_id!=44) and reports_show=1 and date(i.date) between '2017-06-04' and '2017-08-04' and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name) union (SELECT i.item_id,im.item_name,sum(no_of_person) as qty,CONVERT(r.company_amount,DECIMAL(10,2)) as  company_amount,CONVERT((sum(no_of_person)*r.company_amount),DECIMAL(10,2)) as total FROM invoice_header i JOIN item_master im ON im.item_id=i.item_id join rate_master r on i.item_id=r.item_id and '2017-06-04' between from_date and to_date JOIN employee_master e ON e.emp_code=i.emp_code LEFT JOIN company_master cm ON cm.id=e.company WHERE (i.item_id=43 or i.item_id=44) and reports_show=1 and date(i.date) between '2017-06-04' and '2017-08-04' and e.category_id<>6 and e.category_id<>14 and (e.category_id in (SELECT id FROM category_master WHERE id<>2) or  (e.category_id=2 and cm.payable_by='ial')) GROUP BY i.item_id,im.item_name)";
                    if(company=="all" && department=="all")
            {

                pool.query(`SELECT i.emp_code,e.emp_name,cc.company_name,d.dept_name, sum( if( item_id = 1, quanty, 0 ) ) AS breakfast, 
                (sum( if( item_id = 1, quanty, 0 ))* (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount, (sum( if( item_id = 1, quanty, 0 ))* (select r.company_amount from item_master i join 
                    rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount, sum( if( item_id = 2, quanty, 0 ) ) AS lunch,
                    (sum( if( item_id = 2, quanty, 0 ))* (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount, 
                    (sum( if( item_id = 2, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount, 
                    sum( if( item_id = 3, quanty, 0 ) ) AS egg, (sum( if( item_id = 3, quanty, 0 ))* (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount, (sum( if( item_id = 3, quanty, 0 ))* 
                    (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount, sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,
                    (sum( if( item_id = 4, quanty, 0 ))* (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount, (sum( if( item_id = 4, quanty, 0 ))* (select r.company_amount from item_master i join 
                    rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount, sum( if( item_id = 6, quanty, 0 ) ) AS dinner, (sum( if( item_id = 6, quanty, 0 ))*
                    (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount, (sum( if( item_id = 6, quanty, 0 ))* (select r.company_amount from item_master i 
                    join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount, sum( if( item_id = 7, quanty, 0 ) ) AS supper,
                        (sum( if( item_id = 7, quanty, 0 ))* (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount, (sum( if( item_id = 7, quanty, 0 ))* 
                        (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount, 
                        sum( if( item_id = 8, quanty, 0 ) ) AS fruits, (sum( if( item_id = 8, quanty, 0 ))* (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount, 
                        (sum( if( item_id = 8, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount, 
                        sum( if( item_id = 10, quanty, 0 ) ) AS tea, (sum( if( item_id = 10, quanty, 0 ))* (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
                        (sum( if( item_id = 10, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount, 
                        sum( if( item_id = 11, quanty, 0 ) ) AS coffee, (sum( if( item_id = 11, quanty, 0 ))* (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount, 
                        (sum( if( item_id = 11, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount, 
                        sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits, (sum( if( item_id = 12, quanty, 0 ))* (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
                        (sum( if( item_id = 12, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,
                        sum( if( item_id = 13, quanty, 0 ) ) AS snacks, (sum( if( item_id = 13, quanty, 0 ))* (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount, 
                        (sum( if( item_id = 13, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,
                        sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks, (sum( if( item_id = 14, quanty, 0 ))* (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount, 
                        (sum( if( item_id = 14, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,
                            sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast, (sum( if( item_id = 15, quanty, 0 ))* (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount, 
                            (sum( if( item_id = 15, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,
                            sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk, (sum( if( item_id = 35, quanty, 0 ))* (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount, 
                            (sum( if( item_id = 35, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,
                            sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani, (sum( if( item_id = 45, quanty, 0 ))* (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount, 
                            (sum( if( item_id = 45, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,
                            sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani, (sum( if( item_id = 46, quanty, 0 ))* (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount, 
                            (sum( if( item_id = 46, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) 
                            as chicken_briyani_sp_amount FROM invoice_header i JOIN employee_master e ON e.emp_code=i.emp_code JOIN department d ON d.id=e.department join company_master cc on cc.id=e.company WHERE
                (date(i.date) between ? and ?) AND
                    e.category_id=? and i.coupon_no not like '%MET%'
                GROUP BY 
                emp_code
                ORDER BY
                    emp_code,d.dept_name`,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,department],(err,result)=>{
                    if(err) throw err;
                    response.send(result);

                }); 

            }

            else 
            {

                pool.query(`SELECT i.emp_code,e.emp_name,cc.company_name,d.dept_name, sum( if( item_id = 1, quanty, 0 ) ) AS breakfast, 
                (sum( if( item_id = 1, quanty, 0 ))* (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount, (sum( if( item_id = 1, quanty, 0 ))* (select r.company_amount from item_master i join 
                    rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount, sum( if( item_id = 2, quanty, 0 ) ) AS lunch,
                    (sum( if( item_id = 2, quanty, 0 ))* (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount, 
                    (sum( if( item_id = 2, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount, 
                    sum( if( item_id = 3, quanty, 0 ) ) AS egg, (sum( if( item_id = 3, quanty, 0 ))* (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount, (sum( if( item_id = 3, quanty, 0 ))* 
                    (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount, sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,
                    (sum( if( item_id = 4, quanty, 0 ))* (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount, (sum( if( item_id = 4, quanty, 0 ))* (select r.company_amount from item_master i join 
                    rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount, sum( if( item_id = 6, quanty, 0 ) ) AS dinner, (sum( if( item_id = 6, quanty, 0 ))*
                    (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount, (sum( if( item_id = 6, quanty, 0 ))* (select r.company_amount from item_master i 
                    join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount, sum( if( item_id = 7, quanty, 0 ) ) AS supper,
                        (sum( if( item_id = 7, quanty, 0 ))* (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount, (sum( if( item_id = 7, quanty, 0 ))* 
                        (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount, 
                        sum( if( item_id = 8, quanty, 0 ) ) AS fruits, (sum( if( item_id = 8, quanty, 0 ))* (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount, 
                        (sum( if( item_id = 8, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount, 
                        sum( if( item_id = 10, quanty, 0 ) ) AS tea, (sum( if( item_id = 10, quanty, 0 ))* (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
                        (sum( if( item_id = 10, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount, 
                        sum( if( item_id = 11, quanty, 0 ) ) AS coffee, (sum( if( item_id = 11, quanty, 0 ))* (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount, 
                        (sum( if( item_id = 11, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount, 
                        sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits, (sum( if( item_id = 12, quanty, 0 ))* (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
                        (sum( if( item_id = 12, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,
                        sum( if( item_id = 13, quanty, 0 ) ) AS snacks, (sum( if( item_id = 13, quanty, 0 ))* (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount, 
                        (sum( if( item_id = 13, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,
                        sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks, (sum( if( item_id = 14, quanty, 0 ))* (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount, 
                        (sum( if( item_id = 14, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,
                            sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast, (sum( if( item_id = 15, quanty, 0 ))* (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount, 
                            (sum( if( item_id = 15, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,
                            sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk, (sum( if( item_id = 35, quanty, 0 ))* (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount, 
                            (sum( if( item_id = 35, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,
                            sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani, (sum( if( item_id = 45, quanty, 0 ))* (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount, 
                            (sum( if( item_id = 45, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,
                            sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani, (sum( if( item_id = 46, quanty, 0 ))* (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount, 
                            (sum( if( item_id = 46, quanty, 0 ))* (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) 
                            as chicken_briyani_sp_amount FROM invoice_header i JOIN employee_master e ON e.emp_code=i.emp_code JOIN department d ON d.id=e.department join company_master cc on cc.id=e.company WHERE
                (date(i.date) between ? and ?) AND
                    e.category_id=? and(e.department=? or e.company=?) and i.coupon_no not like '%MET%'
                GROUP BY 
                emp_code
                ORDER BY
                    emp_code,d.dept_name`,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,department,company],(err,result)=>{
                    if(err) throw err;
                    response.send(result);

                }); 

            }
            });

            //serviceproviderview

            app.get('/report/serviceproviderview',(request, response)=>{
                var from_date='2019-04-01';
                    var to_date='2020-12-09';
                    var category="1";
                    var department="1";
                    var company="1";
                if(company=="all" && department=="all")
                {
                    console.log("echo");
                    pool.query(`SELECT 
            i.emp_code,e.emp_name,cc.company_name,d.dept_name, 
            sum( if( item_id = 1, quanty, 0 ) ) AS breakfast,
            (sum( if( item_id = 1, quanty, 0 ))*
            (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount,
            (sum( if( item_id = 1, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,
            sum( if( item_id = 2, quanty, 0 ) ) AS lunch,
            (sum( if( item_id = 2, quanty, 0 ))*
            (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount,
            (sum( if( item_id = 2, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,
            sum( if( item_id = 3, quanty, 0 ) ) AS egg,
            (sum( if( item_id = 3, quanty, 0 ))*
            (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount,
            (sum( if( item_id = 3, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,
            sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,
            (sum( if( item_id = 4, quanty, 0 ))*
            (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount,
            (sum( if( item_id = 4, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,
            sum( if( item_id = 6, quanty, 0 ) ) AS dinner,
            (sum( if( item_id = 6, quanty, 0 ))*
            (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount,
            (sum( if( item_id = 6, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,
            sum( if( item_id = 7, quanty, 0 ) ) AS supper,
            (sum( if( item_id = 7, quanty, 0 ))*
            (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount,
            (sum( if( item_id = 7, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,
            sum( if( item_id = 8, quanty, 0 ) ) AS fruits,
            (sum( if( item_id = 8, quanty, 0 ))*
            (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount,
            (sum( if( item_id = 8, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,
            sum( if( item_id = 10, quanty, 0 ) ) AS tea,
            (sum( if( item_id = 10, quanty, 0 ))*
            (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
            (sum( if( item_id = 10, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,
            sum( if( item_id = 11, quanty, 0 ) ) AS coffee,
            (sum( if( item_id = 11, quanty, 0 ))*
            (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount,
            (sum( if( item_id = 11, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,
            sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits,
            (sum( if( item_id = 12, quanty, 0 ))*
            (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
            (sum( if( item_id = 12, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,
            sum( if( item_id = 13, quanty, 0 ) ) AS snacks,
            (sum( if( item_id = 13, quanty, 0 ))*
            (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount,
            (sum( if( item_id = 13, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,
            sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks,
            (sum( if( item_id = 14, quanty, 0 ))*
            (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount,
            (sum( if( item_id = 14, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,
            sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast,
            (sum( if( item_id = 15, quanty, 0 ))*
            (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount,
            (sum( if( item_id = 15, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,
            sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk,
            (sum( if( item_id = 35, quanty, 0 ))*
            (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount,
            (sum( if( item_id = 35, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,
            sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani,
            (sum( if( item_id = 45, quanty, 0 ))*
            (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount,
            (sum( if( item_id = 45, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,
            sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani,
            (sum( if( item_id = 46, quanty, 0 ))*
            (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount,
            (sum( if( item_id = 46, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount,
            cc.payable_by   
            FROM 
            invoice_header i
            JOIN
            employee_master e
            ON
            e.emp_code=i.emp_code
            JOIN department d
            ON
            d.id=e.department
            join company_master cc
            on
            cc.id=e.company
            WHERE
            (date(i.date) between ? and ?) AND
            e.category_id=? 
            GROUP BY 
            emp_code
            ORDER BY
            emp_code,d.dept_name`,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category],(err,result)=>{
                        if(err) throw err;
                            response.send(result);
                        });
                }
            else if(company!="all" && department=="all")
            {
                console.log("echo1");
                pool.query(`SELECT 
                i.emp_code,e.emp_name,cc.company_name,d.dept_name, 
                sum( if( item_id = 1, quanty, 0 ) ) AS breakfast,
                (sum( if( item_id = 1, quanty, 0 ))*
                (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount,
                (sum( if( item_id = 1, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,
                sum( if( item_id = 2, quanty, 0 ) ) AS lunch,
                (sum( if( item_id = 2, quanty, 0 ))*
                (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount,
                (sum( if( item_id = 2, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,
                sum( if( item_id = 3, quanty, 0 ) ) AS egg,
                (sum( if( item_id = 3, quanty, 0 ))*
                (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount,
                (sum( if( item_id = 3, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,
                sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,
                (sum( if( item_id = 4, quanty, 0 ))*
                (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount,
                (sum( if( item_id = 4, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,
                sum( if( item_id = 6, quanty, 0 ) ) AS dinner,
                (sum( if( item_id = 6, quanty, 0 ))*
                (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount,
                (sum( if( item_id = 6, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,
                sum( if( item_id = 7, quanty, 0 ) ) AS supper,
                (sum( if( item_id = 7, quanty, 0 ))*
                (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount,
                (sum( if( item_id = 7, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,
                sum( if( item_id = 8, quanty, 0 ) ) AS fruits,
                (sum( if( item_id = 8, quanty, 0 ))*
                (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount,
                (sum( if( item_id = 8, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,
                sum( if( item_id = 10, quanty, 0 ) ) AS tea,
                (sum( if( item_id = 10, quanty, 0 ))*
                (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
                (sum( if( item_id = 10, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,
                sum( if( item_id = 11, quanty, 0 ) ) AS coffee,
                (sum( if( item_id = 11, quanty, 0 ))*
                (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount,
                (sum( if( item_id = 11, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,
                sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits,
                (sum( if( item_id = 12, quanty, 0 ))*
                (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
                (sum( if( item_id = 12, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,
                sum( if( item_id = 13, quanty, 0 ) ) AS snacks,
                (sum( if( item_id = 13, quanty, 0 ))*
                (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount,
                (sum( if( item_id = 13, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,
                sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks,
                (sum( if( item_id = 14, quanty, 0 ))*
                (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount,
                (sum( if( item_id = 14, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,
                sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast,
                (sum( if( item_id = 15, quanty, 0 ))*
                (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount,
                (sum( if( item_id = 15, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,
                sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk,
                (sum( if( item_id = 35, quanty, 0 ))*
                (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount,
                (sum( if( item_id = 35, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,
                sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani,
                (sum( if( item_id = 45, quanty, 0 ))*
                (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount,
                (sum( if( item_id = 45, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,
                sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani,
                (sum( if( item_id = 46, quanty, 0 ))*
                (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount,
                (sum( if( item_id = 46, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount,
                cc.payable_by   
                FROM 
                invoice_header i
                JOIN
                employee_master e
                ON
                e.emp_code=i.emp_code
                JOIN department d
                ON
                d.id=e.department
                join company_master cc
                on
                cc.id=e.company
                WHERE
                (date(i.date) between ? and ?) AND
                e.category_id=?  and (e.department=? or e.company=?)
                GROUP BY 
                emp_code
                ORDER BY
                emp_code,d.dept_name`,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,department,company],(err,result)=>{
                            if(err) throw err;
                                response.send(result);
                            });


            }
            else if(company=="all" && department!="all")
            {
                console.log("echo2");
                pool.query(`SELECT 
                i.emp_code,e.emp_name,cc.company_name,d.dept_name, 
                sum( if( item_id = 1, quanty, 0 ) ) AS breakfast,
                (sum( if( item_id = 1, quanty, 0 ))*
                (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount,
                (sum( if( item_id = 1, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,
                sum( if( item_id = 2, quanty, 0 ) ) AS lunch,
                (sum( if( item_id = 2, quanty, 0 ))*
                (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount,
                (sum( if( item_id = 2, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,
                sum( if( item_id = 3, quanty, 0 ) ) AS egg,
                (sum( if( item_id = 3, quanty, 0 ))*
                (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount,
                (sum( if( item_id = 3, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,
                sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,
                (sum( if( item_id = 4, quanty, 0 ))*
                (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount,
                (sum( if( item_id = 4, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,
                sum( if( item_id = 6, quanty, 0 ) ) AS dinner,
                (sum( if( item_id = 6, quanty, 0 ))*
                (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount,
                (sum( if( item_id = 6, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,
                sum( if( item_id = 7, quanty, 0 ) ) AS supper,
                (sum( if( item_id = 7, quanty, 0 ))*
                (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount,
                (sum( if( item_id = 7, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,
                sum( if( item_id = 8, quanty, 0 ) ) AS fruits,
                (sum( if( item_id = 8, quanty, 0 ))*
                (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount,
                (sum( if( item_id = 8, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,
                sum( if( item_id = 10, quanty, 0 ) ) AS tea,
                (sum( if( item_id = 10, quanty, 0 ))*
                (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
                (sum( if( item_id = 10, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,
                sum( if( item_id = 11, quanty, 0 ) ) AS coffee,
                (sum( if( item_id = 11, quanty, 0 ))*
                (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount,
                (sum( if( item_id = 11, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,
                sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits,
                (sum( if( item_id = 12, quanty, 0 ))*
                (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
                (sum( if( item_id = 12, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,
                sum( if( item_id = 13, quanty, 0 ) ) AS snacks,
                (sum( if( item_id = 13, quanty, 0 ))*
                (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount,
                (sum( if( item_id = 13, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,
                sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks,
                (sum( if( item_id = 14, quanty, 0 ))*
                (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount,
                (sum( if( item_id = 14, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,
                sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast,
                (sum( if( item_id = 15, quanty, 0 ))*
                (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount,
                (sum( if( item_id = 15, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,
                sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk,
                (sum( if( item_id = 35, quanty, 0 ))*
                (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount,
                (sum( if( item_id = 35, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,
                sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani,
                (sum( if( item_id = 45, quanty, 0 ))*
                (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount,
                (sum( if( item_id = 45, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,
                sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani,
                (sum( if( item_id = 46, quanty, 0 ))*
                (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount,
                (sum( if( item_id = 46, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount,
                cc.payable_by   
                FROM 
                invoice_header i
                JOIN
                employee_master e
                ON
                e.emp_code=i.emp_code
                JOIN department d
                ON
                d.id=e.department
                join company_master cc
                on
                cc.id=e.company
                WHERE
                (date(i.date) between ? and ?) AND
                e.category_id=?  and (e.department=?)
                GROUP BY 
                emp_code
                ORDER BY
                emp_code,d.dept_name`,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,department],(err,result)=>{
                            if(err) throw err;
                                response.send(result);
                            });
            }
            else if(company!="all" && department!="all")
            {
                console.log("echo3");
                pool.query(`SELECT 
                i.emp_code,e.emp_name,cc.company_name,d.dept_name, 
                sum( if( item_id = 1, quanty, 0 ) ) AS breakfast,
                (sum( if( item_id = 1, quanty, 0 ))*
                (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount,
                (sum( if( item_id = 1, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,
                sum( if( item_id = 2, quanty, 0 ) ) AS lunch,
                (sum( if( item_id = 2, quanty, 0 ))*
                (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount,
                (sum( if( item_id = 2, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,
                sum( if( item_id = 3, quanty, 0 ) ) AS egg,
                (sum( if( item_id = 3, quanty, 0 ))*
                (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount,
                (sum( if( item_id = 3, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,
                sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,
                (sum( if( item_id = 4, quanty, 0 ))*
                (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount,
                (sum( if( item_id = 4, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,
                sum( if( item_id = 6, quanty, 0 ) ) AS dinner,
                (sum( if( item_id = 6, quanty, 0 ))*
                (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount,
                (sum( if( item_id = 6, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,
                sum( if( item_id = 7, quanty, 0 ) ) AS supper,
                (sum( if( item_id = 7, quanty, 0 ))*
                (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount,
                (sum( if( item_id = 7, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,
                sum( if( item_id = 8, quanty, 0 ) ) AS fruits,
                (sum( if( item_id = 8, quanty, 0 ))*
                (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount,
                (sum( if( item_id = 8, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,
                sum( if( item_id = 10, quanty, 0 ) ) AS tea,
                (sum( if( item_id = 10, quanty, 0 ))*
                (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
                (sum( if( item_id = 10, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,
                sum( if( item_id = 11, quanty, 0 ) ) AS coffee,
                (sum( if( item_id = 11, quanty, 0 ))*
                (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount,
                (sum( if( item_id = 11, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,
                sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits,
                (sum( if( item_id = 12, quanty, 0 ))*
                (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
                (sum( if( item_id = 12, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,
                sum( if( item_id = 13, quanty, 0 ) ) AS snacks,
                (sum( if( item_id = 13, quanty, 0 ))*
                (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount,
                (sum( if( item_id = 13, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,
                sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks,
                (sum( if( item_id = 14, quanty, 0 ))*
                (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount,
                (sum( if( item_id = 14, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,
                sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast,
                (sum( if( item_id = 15, quanty, 0 ))*
                (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount,
                (sum( if( item_id = 15, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,
                sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk,
                (sum( if( item_id = 35, quanty, 0 ))*
                (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount,
                (sum( if( item_id = 35, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,
                sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani,
                (sum( if( item_id = 45, quanty, 0 ))*
                (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount,
                (sum( if( item_id = 45, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,
                sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani,
                (sum( if( item_id = 46, quanty, 0 ))*
                (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount,
                (sum( if( item_id = 46, quanty, 0 ))*
                (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount,
                cc.payable_by   
                FROM 
                invoice_header i
                JOIN
                employee_master e
                ON
                e.emp_code=i.emp_code
                JOIN department d
                ON
                d.id=e.department
                join company_master cc
                on
                cc.id=e.company
                WHERE
                (date(i.date) between ? and ?) AND
                e.category_id=?  and (e.department=? or e.company=?)
                GROUP BY 
                emp_code
                ORDER BY
                emp_code,d.dept_name`,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,department,company],(err,result)=>{
                            if(err) throw err;
                                response.send(result);
                            });

            }


            });
            // guestview
            app.get('/report/guestview',(request, response)=>{
                var from_date='2019-04-01';
                var to_date='2020-12-09';
                var category="1";
                var department="1";
                var company="1";
                if(department=="all")
                {
                console.log("echo");
                pool.query(`  
                                                                            
                (SELECT 
            date(i.date),i.emp_code,g.emp_name,g.company_name,d.dept_name, 
            sum( if( item_id = 1, quanty, 0 ) ) AS breakfast,

            (sum( if( item_id = 1, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,

            sum( if( item_id = 2, quanty, 0 ) ) AS lunch,

            (sum( if( item_id = 2, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,

            sum( if( item_id = 3, quanty, 0 ) ) AS egg,

            (sum( if( item_id = 3, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,

            sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,

            (sum( if( item_id = 4, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,


            sum( if( item_id = 6, quanty, 0 ) ) AS dinner,

            (sum( if( item_id = 6, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,

            sum( if( item_id = 7, quanty, 0 ) ) AS supper,

            (sum( if( item_id = 7, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,

            sum( if( item_id = 8, quanty, 0 ) ) AS fruits,

            (sum( if( item_id = 8, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,

            sum( if( item_id = 10, quanty, 0 ) ) AS tea,

            (sum( if( item_id = 10, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,

            sum( if( item_id = 11, quanty, 0 ) ) AS coffee,


            (sum( if( item_id = 11, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,

            sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits,

            (sum( if( item_id = 12, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,




            sum( if( item_id = 13, quanty, 0 ) ) AS snacks,

            (sum( if( item_id = 13, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,

            sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks,

            (sum( if( item_id = 14, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,

            sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast,

            (sum( if( item_id = 15, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,

            sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk,

            (sum( if( item_id = 35, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,

            sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani,

            (sum( if( item_id = 45, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,

            sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani,

            (sum( if( item_id = 46, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount

            FROM 
            invoice_header i
            JOIN
            guest g
            ON
            g.id=i.guest_id
            JOIN department d
            ON
            d.id=g.dept_id

            WHERE
            (date(i.date) between ? and ?) AND
            i.category_id=?
            GROUP BY 
            i.guest_id
            ORDER BY
            emp_code,d.dept_name)
            union
            (SELECT 
            date(i.date),i.emp_code,e.emp_name,g.company,d.dept_name, 
            sum( if(i.item_id = 1, quanty, 0 ) ) AS breakfast,

            (sum( if(i.item_id = 1, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,

            sum( if(i.item_id = 2, quanty, 0 ) ) AS lunch,

            (sum( if(i.item_id = 2, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,

            sum( if(i.item_id = 3, quanty, 0 ) ) AS egg,

            (sum( if(i.item_id = 3, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,

            sum( if(i.item_id = 4, quanty, 0 ) ) AS nonveg,

            (sum( if(i.item_id = 4, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,


            sum( if(i.item_id = 6, quanty, 0 ) ) AS dinner,

            (sum( if(i.item_id = 6, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,

            sum( if(i.item_id = 7, quanty, 0 ) ) AS supper,

            (sum( if(i.item_id = 7, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,

            sum( if(i.item_id = 8, quanty, 0 ) ) AS fruits,

            (sum( if(i.item_id = 8, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,

            sum( if(i.item_id = 10, quanty, 0 ) ) AS tea,

            (sum( if(i.item_id = 10, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,

            sum( if(i.item_id = 11, quanty, 0 ) ) AS coffee,


            (sum( if(i.item_id = 11, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,

            sum( if(i.item_id = 12, quanty, 0 ) ) AS Biscuits,

            (sum( if(i.item_id = 12, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,




            sum( if(i.item_id = 13, quanty, 0 ) ) AS snacks,

            (sum( if(i.item_id = 13, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,

            sum( if(i.item_id = 14, quanty, 0 ) ) AS cooldrinks,

            (sum( if(i.item_id = 14, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,

            sum( if(i.item_id = 15, quanty, 0 ) ) AS extra_breakfast,

            (sum( if(i.item_id = 15, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,

            sum( if(i.item_id = 35, quanty, 0 ) ) AS buttermilk,

            (sum( if(i.item_id = 35, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,

            sum( if(i.item_id = 45, quanty, 0 ) ) AS mutton_briyani,

            (sum( if(i.item_id = 45, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,

            sum( if(i.item_id = 46, quanty, 0 ) ) AS chicken_briyani,

            (sum( if(i.item_id = 46, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount

            FROM 
            invoice_header i
            JOIN
            guest_manual_entry g
            ON
            g.id=i.guest_id
            join employee_master e on e.emp_code=i.emp_code
            JOIN department d
            ON
            d.id=e.department

            WHERE
            (date(i.date) between ? and ?) AND
            i.category_id=?
            GROUP BY 
            i.guest_id
            ORDER BY
            emp_code,d.dept_name)
            `,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category],(err,result)=>{
                    if(err) throw err;
                    response.send(result);
                });

            }
            else if(department!="all")
            {
                console.log("echo1");
                pool.query(`  
                                                                            
                (SELECT 
            date(i.date),i.emp_code,g.emp_name,g.company_name,d.dept_name, 
            sum( if( item_id = 1, quanty, 0 ) ) AS breakfast,

            (sum( if( item_id = 1, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,

            sum( if( item_id = 2, quanty, 0 ) ) AS lunch,

            (sum( if( item_id = 2, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,

            sum( if( item_id = 3, quanty, 0 ) ) AS egg,

            (sum( if( item_id = 3, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,

            sum( if( item_id = 4, quanty, 0 ) ) AS nonveg,

            (sum( if( item_id = 4, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,


            sum( if( item_id = 6, quanty, 0 ) ) AS dinner,

            (sum( if( item_id = 6, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,

            sum( if( item_id = 7, quanty, 0 ) ) AS supper,

            (sum( if( item_id = 7, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,

            sum( if( item_id = 8, quanty, 0 ) ) AS fruits,

            (sum( if( item_id = 8, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,

            sum( if( item_id = 10, quanty, 0 ) ) AS tea,

            (sum( if( item_id = 10, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,

            sum( if( item_id = 11, quanty, 0 ) ) AS coffee,


            (sum( if( item_id = 11, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,

            sum( if( item_id = 12, quanty, 0 ) ) AS Biscuits,

            (sum( if( item_id = 12, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,




            sum( if( item_id = 13, quanty, 0 ) ) AS snacks,

            (sum( if( item_id = 13, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,

            sum( if( item_id = 14, quanty, 0 ) ) AS cooldrinks,

            (sum( if( item_id = 14, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,

            sum( if( item_id = 15, quanty, 0 ) ) AS extra_breakfast,

            (sum( if( item_id = 15, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,

            sum( if( item_id = 35, quanty, 0 ) ) AS buttermilk,

            (sum( if( item_id = 35, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,

            sum( if( item_id = 45, quanty, 0 ) ) AS mutton_briyani,

            (sum( if( item_id = 45, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,

            sum( if( item_id = 46, quanty, 0 ) ) AS chicken_briyani,

            (sum( if( item_id = 46, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount

            FROM 
            invoice_header i
            JOIN
            guest g
            ON
            g.id=i.guest_id
            JOIN department d
            ON
            d.id=g.dept_id

            WHERE
            (date(i.date) between ? and ?) AND
            i.category_id=?
            GROUP BY 
            i.guest_id
            ORDER BY
            emp_code,d.dept_name)
            union
            (SELECT 
            date(i.date),i.emp_code,e.emp_name,g.company,d.dept_name, 
            sum( if(i.item_id = 1, quanty, 0 ) ) AS breakfast,

            (sum( if(i.item_id = 1, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,

            sum( if(i.item_id = 2, quanty, 0 ) ) AS lunch,

            (sum( if(i.item_id = 2, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,

            sum( if(i.item_id = 3, quanty, 0 ) ) AS egg,

            (sum( if(i.item_id = 3, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,

            sum( if(i.item_id = 4, quanty, 0 ) ) AS nonveg,

            (sum( if(i.item_id = 4, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,


            sum( if(i.item_id = 6, quanty, 0 ) ) AS dinner,

            (sum( if(i.item_id = 6, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,

            sum( if(i.item_id = 7, quanty, 0 ) ) AS supper,

            (sum( if(i.item_id = 7, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,

            sum( if(i.item_id = 8, quanty, 0 ) ) AS fruits,

            (sum( if(i.item_id = 8, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,

            sum( if(i.item_id = 10, quanty, 0 ) ) AS tea,

            (sum( if(i.item_id = 10, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,

            sum( if(i.item_id = 11, quanty, 0 ) ) AS coffee,


            (sum( if(i.item_id = 11, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,

            sum( if(i.item_id = 12, quanty, 0 ) ) AS Biscuits,

            (sum( if(i.item_id = 12, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,




            sum( if(i.item_id = 13, quanty, 0 ) ) AS snacks,

            (sum( if(i.item_id = 13, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,

            sum( if(i.item_id = 14, quanty, 0 ) ) AS cooldrinks,

            (sum( if(i.item_id = 14, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,

            sum( if(i.item_id = 15, quanty, 0 ) ) AS extra_breakfast,

            (sum( if(i.item_id = 15, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,

            sum( if(i.item_id = 35, quanty, 0 ) ) AS buttermilk,

            (sum( if(i.item_id = 35, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,

            sum( if(i.item_id = 45, quanty, 0 ) ) AS mutton_briyani,

            (sum( if(i.item_id = 45, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,

            sum( if(i.item_id = 46, quanty, 0 ) ) AS chicken_briyani,

            (sum( if(i.item_id = 46, quanty, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount

            FROM 
            invoice_header i
            JOIN
            guest_manual_entry g
            ON
            g.id=i.guest_id
            join employee_master e on e.emp_code=i.emp_code
            JOIN department d
            ON
            d.id=e.department

            WHERE
            (date(i.date) between ? and ?) AND
            i.category_id=? and d.id=?
            GROUP BY 
            i.guest_id
            ORDER BY
            emp_code,d.dept_name)
            `,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,category,department],(err,result)=>{
                    if(err) throw err;
                    response.send(result);
                });

            }

            });
            //Meetingrequestview

            app.get('/report/meetingrequestrview',(request, response)=>{
                var from_date='2019-04-01';
                    var to_date='2020-12-09';
                    var category="1";
                    var department="all";
                    var company="1";
                if(department=="all")
                {
                    console.log("echo");
                    pool.query(`SELECT 
            mh.emp_code,e.emp_name,mh.no_of_persons,d.dept_name, 
            sum( if( item_id = 1, quantity, 0 ) ) AS breakfast,
            (sum( if( item_id = 1, quantity, 0 ))*
            (select employee_amount from item_master where item_id=1)) as breakfast_subsidy_amount,
            (sum( if( item_id = 1, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=1)) as breakfast_sp_amount,

            sum( if( item_id = 2, quantity, 0 ) ) AS lunch,
            (sum( if( item_id = 2, quantity, 0 ))*
            (select employee_amount from item_master where item_id=2)) as lunch_subsidy_amount,
            (sum( if( item_id = 2, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=2)) as lunch_sp_amount,

            sum( if( item_id = 3, quantity, 0 ) ) AS egg,
            (sum( if( item_id = 3, quantity, 0 ))*
            (select employee_amount from item_master where item_id=3)) as egg_subsidy_amount,
            (sum( if( item_id = 3, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=3)) as egg_sp_amount,

            sum( if( item_id = 4, quantity, 0 ) ) AS nonveg,
            (sum( if( item_id = 4, quantity, 0 ))*
            (select employee_amount from item_master where item_id=4)) as nonveg_subsidy_amount,
            (sum( if( item_id = 4, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=4)) as nonveg_sp_amount,


            sum( if( item_id = 6, quantity, 0 ) ) AS dinner,
            (sum( if( item_id = 6, quantity, 0 ))*
            (select employee_amount from item_master where item_id=6)) as dinner_subsidy_amount,
            (sum( if( item_id = 6, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=6)) as dinner_sp_amount,

            sum( if( item_id = 7, quantity, 0 ) ) AS supper,
            (sum( if( item_id = 7, quantity, 0 ))*
            (select employee_amount from item_master where item_id=7)) as supper_subsidy_amount,
            (sum( if( item_id = 7, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=7)) as supper_sp_amount,

            sum( if( item_id = 8, quantity, 0 ) ) AS fruits,
            (sum( if( item_id = 8, quantity, 0 ))*
            (select employee_amount from item_master where item_id=8)) as fruits_subsidy_amount,
            (sum( if( item_id = 8, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=8)) as fruits_sp_amount,

            sum( if( item_id = 10, quantity, 0 ) ) AS tea,
            (sum( if( item_id = 10, quantity, 0 ))*
            (select employee_amount from item_master where item_id=10)) as tea_subsidy_amount,
            (sum( if( item_id = 10, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=10)) as tea_sp_amount,

            sum( if( item_id = 11, quantity, 0 ) ) AS coffee,
            (sum( if( item_id = 11, quantity, 0 ))*
            (select employee_amount from item_master where item_id=11)) as coffee_subsidy_amount,

            (sum( if( item_id = 11, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=11)) as coffee_sp_amount,

            sum( if( item_id = 12, quantity, 0 ) ) AS Biscuits,
            (sum( if( item_id = 12, quantity, 0 ))*
            (select employee_amount from item_master where item_id=12)) as biscuits_subsidy_amount,
            (sum( if( item_id = 12, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=12)) as biscuits_sp_amount,




            sum( if( item_id = 13, quantity, 0 ) ) AS snacks,
            (sum( if( item_id = 13, quantity, 0 ))*
            (select employee_amount from item_master where item_id=13)) as snacks_subsidy_amount,
            (sum( if( item_id = 13, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=13)) as snacks_sp_amount,

            sum( if( item_id = 14, quantity, 0 ) ) AS cooldrinks,
            (sum( if( item_id = 14, quantity, 0 ))*
            (select employee_amount from item_master where item_id=14)) as cooldrinks_subsidy_amount,
            (sum( if( item_id = 14, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=14)) as cooldrinks_sp_amount,

            sum( if( item_id = 15, quantity, 0 ) ) AS extra_breakfast,
            (sum( if( item_id = 15, quantity, 0 ))*
            (select employee_amount from item_master where item_id=15)) as extra_breakfast_subsidy_amount,
            (sum( if( item_id = 15, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=15)) as extra_breakfast_sp_amount,

            sum( if( item_id = 35, quantity, 0 ) ) AS buttermilk,
            (sum( if( item_id = 35, quantity, 0 ))*
            (select employee_amount from item_master where item_id=35)) as buttermilk_subsidy_amount,
            (sum( if( item_id = 35, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=35)) as buttermilk_sp_amount,

            sum( if( item_id = 45, quantity, 0 ) ) AS mutton_briyani,
            (sum( if( item_id = 45, quantity, 0 ))*
            (select employee_amount from item_master where item_id=45)) as mutton_briyani_subsidy_amount,
            (sum( if( item_id = 45, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=45)) as mutton_briyani_sp_amount,

            sum( if( item_id = 46, quantity, 0 ) ) AS chicken_briyani,
            (sum( if( item_id = 46, quantity, 0 ))*
            (select employee_amount from item_master where item_id=46)) as chicken_briyani_subsidy_amount,
            (sum( if( item_id = 46, quantity, 0 ))*
            (select r.company_amount from item_master i join rate_master r on i.item_id=r.item_id and ? between from_date and to_date where i.item_id=46)) as chicken_briyani_sp_amount

            FROM 
            meeting_header mh
            JOIN
            meeting_detail md
            ON
            md.meeting_header_code=mh.code
            JOIN
            employee_master e
            ON
            e.emp_code=mh.emp_code

            JOIN department d
            ON
            d.id=mh.department_id

            WHERE
            (date(mh.date) between ? and ?)  and mh.status=1

            GROUP BY
            mh.emp_code

            ORDER BY
            emp_code,d.dept_name
            `,[from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,from_date,to_date,],(err,result)=>{
                        if(err) throw err;
                        response.send(result);
                    }); 

                }
                
            
            });





app.listen(port,()=>{ console.log(`server connected...${port}`); });

