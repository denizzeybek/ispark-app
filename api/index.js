const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
 
var cors = require('cors')
app.use(cors())

// parse application/json
app.use(bodyParser.json());
 


//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'P3kc4n123+',
  database: 'ispark',
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//show park_infos
app.get('/api/park_infos',(req, res) => {
  let sql = "SELECT * FROM park_infos";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show park_type
app.get('/api/park_type',(req, res) => {
  let sql = "SELECT * FROM park_type";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show average parking capacity of the car parks
app.get('/api/average_parking_capacity',(req, res) => {
  let sql = "SELECT avg(property_value) as 'Avarage Parking Capacity' from park_properties join properties on park_properties.property_id = properties.property_id where property_name = 'Park Kapasitesi'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show average of open car park’s hours of the car parks
app.get('/api/average_of_open_car_parks_hours',(req, res) => {
  let sql = "select round(avg(left(hour_end-hour_start, 2))) as 'Average work hours of open car parking space' from working_hours join park_infos on working_hours.working_hours_id = park_infos.working_hours_id where park_id in (select park_id from park_infos join park_type on park_infos.type_id = park_type.type_id where type_name = 'Açık Otopark')";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show maximum price of car parking for all day?
app.get('/api/max_price_of_car_parking_for_all_day',(req, res) => {
  let sql = "select max(price_value) as 'Maximum price of Parking for All Day' from park_hourly_prices join hourly_prices on park_hourly_prices.price_id = hourly_prices.price_id where period_start = 0 and period_end = 24";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//show minimum car parking capacity
app.get('/api/min_car_parking_capacity',(req, res) => {
  let sql = "select min(property_value) as 'Minumum Parking Capacity' from park_properties join properties on park_properties.property_id = properties.property_id where property_name = 'Park Kapasitesi'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show maximum price of monthly subscription of car park
app.get('/api/max_price_of_monthly_subscription_of_car_park',(req, res) => {
  let sql = "select max(property_value) as 'Maximum price of Monthly Subs.' from park_properties join properties on park_properties.property_id = properties.property_id where property_name = 'Aylık Abonelik Ücreti'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show district has maximum car parking spaces
app.get('/api/district_max_car_parking_spaces',(req, res) => {
  let sql = "select district_name from district where district_id = (select district_id from location where location_id = (select location_id from geographic_info where geographic_id = ( select geographic_id from park_infos where park_id =(select max(park_id) from park_properties join properties on park_properties.property_id = properties.property_id where property_name = 'Park Kapasitesi' ))))";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show average of monthly subscription of car park 
app.get('/api/avg_monthly_subscription_car_parks',(req, res) => {
  let sql = " select avg(property_value) as 'Average price of Monthly Subs.' from park_properties join properties on park_properties.property_id = properties.property_id where property_name = 'Aylık Abonelik Ücreti' ";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show maximum time of free parking *****
app.get('/api/max_time_free_parking',(req, res) => {
  let sql = "select max(property_value) as 'Maximum time of free parking' from park_properties join properties on park_properties.property_id = properties.property_id where property_name = 'Ücretsiz Parklanma Süresi'";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show average work hours of car parking space
app.get('/api/avg_work_hours_of_car_parking_space',(req, res) => {
  let sql = "select round(avg(left(hour_end-hour_start, 2))) as 'Average work hours of car parking space'  from working_hours";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show average of open car parking spaces
app.get('/api/avg_of_open_car_parking_spaces',(req, res) => {
  let sql = "select CONCAT('%', round((sum(type_name = 'Acık Otopark') / count(park_id)) * 100))  as 'Average of open car parking spaces' from park_infos join park_type on park_infos.type_id = park_type.type_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show count of existing sub regions of region
app.get('/api/count_of_existing_sub_regions_of_region',(req, res) => {
  let sql = "select region_name as 'Region Name', count(sub_region_id) as 'Count of Sub Region' from regions join sub_regions on regions.region_id = sub_regions.region_id group by region_name";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show count of existing sub regions of region
app.get('/api/park_id',(req, res) => {
  let sql = "SELECT * FROM park_properties";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single product
app.get('/api/park_id/:id',(req, res) => {
  let sql = "SELECT * FROM park_properties WHERE park_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//**************************************************** */

//show park properties
app.get('/api/park_properties',(req, res) => {
  let sql = "select * from park_properties join properties on park_properties.property_id = properties.property_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single park properties
app.get('/api/park_properties/:id',(req, res) => {
  let sql = "select * from park_properties join properties on park_properties.property_id = properties.property_id WHERE park_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//show park properties
app.get('/api/park_prices',(req, res) => {
  let sql = "select * from park_hourly_prices join hourly_prices on park_hourly_prices.price_id = hourly_prices.price_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single park prices
app.get('/api/park_prices/:id',(req, res) => {
  let sql = "select * from park_hourly_prices join hourly_prices on park_hourly_prices.price_id = hourly_prices.price_id WHERE park_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show park working hours
app.get('/api/park_working_hours',(req, res) => {
  let sql = "select * from park_infos join working_hours on working_hours.working_hours_id = park_infos.working_hours_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//show single park working hours
app.get('/api/park_working_hours/:id',(req, res) => {
  let sql = "select * from park_infos join working_hours on working_hours.working_hours_id = park_infos.working_hours_id WHERE park_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//show park type
app.get('/api/park_type',(req, res) => {
  let sql = "select * from park_infos join park_type on park_type.type_id = park_infos.type_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single park type
app.get('/api/park_type/:id',(req, res) => {
  let sql = "select * from park_infos join park_type on park_type.type_id = park_infos.type_id where park_id = "+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


//show general park infos
app.get('/api/general_park_infos',(req, res) => {
  let sql = "select * from park_infos join geographic_info on park_infos.geographic_id = geographic_info.geographic_id join location on location.location_id = geographic_info.location_id join district on district.district_id = location.district_id join sub_regions on sub_regions.sub_region_id = district.sub_region_id join regions on regions.region_id = sub_regions.region_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show general park infos
app.get('/api/general_park_infos/:id',(req, res) => {
  let sql = "select * from park_infos join geographic_info on park_infos.geographic_id = geographic_info.geographic_id join location on location.location_id = geographic_info.location_id join district on district.district_id = location.district_id join sub_regions on sub_regions.sub_region_id = district.sub_region_id join regions on regions.region_id = sub_regions.region_id where park_id = "+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});


const port = process.env.PORT || 3000;
//Server listening
app.listen(port,() =>{
  console.log(`starting server at  ${port}`);
});