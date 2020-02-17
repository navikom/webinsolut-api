import { Router } from "express";
import Categories from "@app/controllers/pixart/category.controller";
import Pictures from "@app/controllers/pixart/picture.controller";
import { common } from "@app/routes/v1";
import { upload } from "@app/middleware/uploader";

export default function (router: Router, mustAuthenticated: any) {

  //********* PICTURE CATEGORIES ********************
  common(Categories, "pixart-categories");
  router.get("/pixart-categories", (req, res) => Categories.getAll(req, res));

  //********* PICTURES ********************
  router.get("/pixart-pictures/:page/:pageSize",
    (req, res) => Pictures.getWithPagination(req, res));
  router.post("/pixart-pictures", mustAuthenticated,
    upload.array("file", 10),
    (req, res) => Pictures.save(req, res));
  common(Pictures, "pixart-pictures");

}
