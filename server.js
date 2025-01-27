const express = require("express");
const app = express();
const multer = require("multer");
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const File = require('./models/file.js')
dotenv.config();

app.use(express.urlencoded({extended: true}));

const upload = multer({dest: "uploads"})
app.set("view engine", "ejs")
app.use(express.static("public"))

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/oknow", upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        orignalName: req.file.originalname

    }
    if(req.body.password != null && req.body.password !== ""){
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }
    
    
    const file = await File.create(fileData)
    // console.log(file)
    // res.send(file.originalname)
    res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}`})
})

app.get("/file/:id", handelDownload)
app.post("/file/:id", handelDownload)

// app.route("/file/:id").get(handelDownload).post(handelDownload)

async function handelDownload(req, res) {
    const file = await File.findById(req.params.id)

    if(file.password != null){
        if(req.body.password == null){
            res.render("password")
            return
        }
        if(!(await bcrypt.compare(req.body.password, file.password))){
            res.render("password", {error: true})
            return
        }
    }

    file.downloadCount++;
    await file.save()
    // console.log(`fileName: ${file.orignalName},fileDownloadCount: ${file.downloadCount}`)
    res.download(file.path, file.orignalName)
    // res.send("hi")
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log("App is listening on port 3000");
})
