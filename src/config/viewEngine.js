import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public")); // source lay hinh anh         
    app.set("view engine", "ejs"); // doc file ejs
    app.set("views", "./src/views") // mac dinh foler lay view
}

module.exports = configViewEngine;