import express from 'express';
import path from 'path';

import {Model} from 'sequelize-typescript';
import Auth from '@app/controllers/auth.controller';
import Users from '@app/controllers/user.controller';
import Events from '@app/controllers/event.controller';
import Apps from '@app/controllers/app.controller';
import AppCategory from '@app/controllers/appCategory.controller';
import Migrate from '@app/controllers/migrate.controller';
import Cards from '@app/controllers/card.controller';
import Devices from '@app/controllers/device.controller';
import Images from '@app/controllers/image.controller';
import Payments from '@app/controllers/payment.controller';
import WithdrawMethods from '@app/controllers/withdrawMethod.controller';
import Crashes from '@app/controllers/crash.controller';
import Setting from '@app/controllers/setting.controller';
import Roles from '@app/controllers/role.controller';
import Campaigns from '@app/controllers/campaign.controller';
import Segments from '@app/controllers/segment.controller';
import Regions from '@app/controllers/region.controller';

import callPassport from '@app/middleware/passport';
import {MainController} from '@app/controllers/main.controller';
import pixartRoutes from '@app/routes/pixart';
import {upload} from '@app/middleware/uploader';

const router = express.Router();

const mustAuthenticated = callPassport();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({status: "success", message: "API 2", data: {"version_number": "v1.0.0"}})
});

export function common(controller: MainController<Model>, name: string) {
  router.get(`/${name}/:id`, mustAuthenticated, (req, res) => controller.getOne(req, res));
  router.post(`/${name}`, mustAuthenticated, (req, res) => controller.create(req, res));      // C
  router.get(`/${name}`, mustAuthenticated, (req, res) => controller.getAll(req, res));       // R
  router.put(`/${name}/:id`,
    mustAuthenticated,
    upload.array('file', 10), (req, res) => controller.update(req, res));       // U
  router.delete(`/${name}/:id`, mustAuthenticated, (req, res) => controller.delete(req, res));// D
  router.get(`/${name}/:page/:pageSize`, mustAuthenticated, (req, res) => controller.getWithPagination(req, res));
}

//********* AUTH ***************
router.post('/users/sign-up', Auth.create);
router.post('/users/login', Auth.login);
router.post('/users/anonymous', Auth.anonymous);
router.post('/users/forgot', Auth.forgotPassword);
router.get('/users/reset/:app/:token', Auth.resetStart);
router.post('/users/reset/:app/:token', Auth.resetComplete);
router.get('/users/logout',  mustAuthenticated, Auth.logout);
router.post('/users/change-password', mustAuthenticated, Auth.changePassword);

//********* APPS CATEGORY ***************
common(AppCategory, 'app-categories');

//********* APPS ***************
common(Apps, 'apps');
router.put(`/apps/:id/images/sort`, mustAuthenticated, (req, res) => Apps.sortImages(req, res));
router.delete('/apps/:id/image/:imageId', mustAuthenticated,
  (req, res) => Apps.deleteAppImage(req, res));

//********* USERS ********************
common(Users, 'users');
router.get(`/users/:page/:pageSize/user/:userId/referrals`, mustAuthenticated,
  (req, res) => Users.getReferralsWithPagination(req, res));
router.post(`/users/:userId/update-role/:roleId`, mustAuthenticated,
  (req, res) => Users.updateRole(req, res));
router.get(`/users/:userId/subscription/:channel/:action`,
  (req, res) => Users.updateSubscription(req, res));

//********* EVENTS ********************
common(Events, 'events');
router.get(`/events/:page/:pageSize/user/:userId`, mustAuthenticated,
  (req, res) => Events.getByUserWithPagination(req, res));

//********* CARDS ********************
common(Cards, 'cards');

//********* DEVICES ********************
common(Devices, 'devices');

//********* IMAGES ********************
common(Images, 'images');

//********* PAYMENTS ********************
common(Payments, 'payments');

//********* WITHDRAW METHODS ********************
common(WithdrawMethods, 'withdraw-methods');

//********* CRASHES ***************************
common(Crashes, 'crashes');
router.post('/crashes', Crashes.create);

//********* SETTINGS ***************************
router.get('/settings', Setting.fetch);

//********* ROLES ************************
common(Roles, 'roles');

//********* SEGMENTS ************************
common(Segments, 'segments');

//********* REGIONS ************************
common(Regions, 'regions');

//********* CAMPAIGNS ************************
common(Campaigns, 'campaigns');
router.get(`/campaigns/:page/:pageSize/:channel`, mustAuthenticated,
  (req, res) => Campaigns.getWithPagination(req, res));

pixartRoutes(router, mustAuthenticated);

//********* EXPORTER ***********
router.get('/exporter/export-data/:fileName', Migrate.exportData);
router.get('/exporter/test-insert', Migrate.insertData);

//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, 'public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, 'public/v1/documentation/dist')));
router.use('/oauth/auth', express.static(path.join(__dirname, 'public/v1/documentation/dist/oauth2-redirect.html')));
export default router;
