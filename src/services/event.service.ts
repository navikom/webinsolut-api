import { Payment } from "@app/models/payment.model";
import { Event } from "@app/models/event.model";
import { RichRequest } from "@app/interfaces/RichRequest";

const APP_DOWNLOAD_EVENT = "App Download";
const SESSION_START_EVENT = "Session Start";
const SESSION_END_EVENT = "Session End";
const APP_UNINSTALLED_EVENT = "App Uninstalled";
const USER_REGISTERED_EVENT = "User Registered";
const USER_LOGIN_EVENT = "User Login";
const USER_LOGOUT_EVENT = "User Logout";
const APP_UPGRADE_EVENT = "App Upgrade";
const APP_CRASH_EVENT = "App Crash";
const PAYMENT_SUCCESS_EVENT = "Payment Success";
const PAYMENT_FAILURE_EVENT = "Payment Failure";
const NOTIFICATION_EMAIL_STATUS_CHANGED_EVENT = "Email Subscription";
const NOTIFICATION_SMS_STATUS_CHANGED_EVENT = "SMS Subscription";
const EMAIL_VERIFIED_EVENT = "Email Verified";
const REFERRAL_ADDED_EVENT = "Referral Added";
const CARD_ADDED_EVENT = "Card Added";
const ADDS_PRESSED_EVENT = "Adds Pressed";
const EMAIL_ACCEPTED = "Email Accepted";
const EMAIL_BOUNCED = "Email Bounced";
const EMAIL_DELIVERED = "Email Delivered";
const EMAIL_OPEN = "Email Open";
const EMAIL_REJECTED = "Email Rejected";
const EMAIL_UNSUBSCRIBE = "Email Unsubscribe";
const GSM_APNS_REGISTERED = "GSM/APNs Registered";
const JOURNEY_ENDED = "Journey Ended";
const JOURNEY_STARTED = "Journey Started";
const IN_APP_NOTIFICATION_CLICK = "In-app Notification Click";
const IN_APP_NOTIFICATION_CLOSE = "In-app Notification Close";
const IN_APP_NOTIFICATION_IMPRESSION = "In-app Notification Impression";
const PUSH_RECEIVED = "Push Received";
const PUSH_SENT = "Push Sent";
const PUSH_CLICK = "Push Click";
const PUSH_DISMISS = "Push Dismiss";

const info = (req: RichRequest) => ({
  app: req.iapp!.toJSON(),
  device: req.device ? req.device.toJSON() : null,
  region: req.region ? req.region.toJSON() : null
});

export default class EventsService {

  static createEvent(title: string, userId: number | null, req: RichRequest, data: any = {}) {
    if (!req.iapp) return;
    Event.create({
      userId,
      title,
      ...info(req),
      info: {
        ...data
      }
    });
  }

  static appDownload(userId: number, req: RichRequest) {
    this.createEvent(APP_DOWNLOAD_EVENT, userId, req);
  }

  static sessionStart(userId: number, req: RichRequest) {
    this.createEvent(SESSION_START_EVENT, userId, req);
  }

  static sessionEnd(userId: number, req: RichRequest) {
    this.createEvent(SESSION_END_EVENT, userId, req);
  }

  static appUninstall(userId: number, req: RichRequest) {
    this.createEvent(APP_UNINSTALLED_EVENT, userId, req);
  }

  static userRegister(userId: number, req: RichRequest) {
    this.createEvent(USER_REGISTERED_EVENT, userId, req);
  }

  static userLogin(userId: number, req: RichRequest) {
    this.createEvent(USER_LOGIN_EVENT, userId, req);
  }

  static userLogout(userId: number, req: RichRequest) {
    this.createEvent(USER_LOGOUT_EVENT, userId, req);
  }

  static appUpgraded(userId: number, req: RichRequest) {
    this.createEvent(APP_UPGRADE_EVENT, userId, req);
  }

  static appCrashed(req: RichRequest) {
    this.createEvent(APP_CRASH_EVENT, req.session && req.session.user ? req.session.user.userId : null, req);
  }

  static paymentSuccess(userId: number, payment: Payment, req: RichRequest) {
    this.createEvent(PAYMENT_SUCCESS_EVENT, userId, req, { payment: payment.toJSON() });
  }

  static paymentFailed(userId: number, payment: Payment, req: RichRequest) {
    this.createEvent(PAYMENT_FAILURE_EVENT, userId, req, { payment: payment.toJSON() });
  }

  static notificationSmsStatusChanged(userId: number, req: RichRequest) {
    this.createEvent(NOTIFICATION_SMS_STATUS_CHANGED_EVENT, userId, req);
  }

  static notificationEmailStatusChanged(userId: number, req: RichRequest) {
    this.createEvent(NOTIFICATION_EMAIL_STATUS_CHANGED_EVENT, userId, req);
  }

  static emailVerified(userId: number, req: RichRequest) {
    this.createEvent(EMAIL_VERIFIED_EVENT, userId, req);
  }

  // static referralAdded(referral: User, req: RichRequest) {
  //   this.createEvent(REFERRAL_ADDED_EVENT, referral.referrer, req, { referral: referral.toJSON() });
  // }

  static cardAdded(card: number, userId: number, req: RichRequest) {
    this.createEvent(CARD_ADDED_EVENT, userId, req, { card });
  }

  static adsPressed(userId: number, req: RichRequest, ads: any) {
    this.createEvent(CARD_ADDED_EVENT, userId, req, { ads });
  }

  static systemEventsList() {
    return [APP_DOWNLOAD_EVENT, SESSION_START_EVENT, SESSION_END_EVENT, APP_UNINSTALLED_EVENT, USER_REGISTERED_EVENT,
      USER_LOGIN_EVENT, USER_LOGOUT_EVENT, APP_UPGRADE_EVENT, APP_CRASH_EVENT, PAYMENT_SUCCESS_EVENT,
      PAYMENT_FAILURE_EVENT, NOTIFICATION_EMAIL_STATUS_CHANGED_EVENT, NOTIFICATION_SMS_STATUS_CHANGED_EVENT,
      EMAIL_VERIFIED_EVENT, REFERRAL_ADDED_EVENT, CARD_ADDED_EVENT, ADDS_PRESSED_EVENT, EMAIL_ACCEPTED,
      EMAIL_BOUNCED, EMAIL_DELIVERED, EMAIL_OPEN, EMAIL_REJECTED, EMAIL_UNSUBSCRIBE, GSM_APNS_REGISTERED,
      IN_APP_NOTIFICATION_IMPRESSION, IN_APP_NOTIFICATION_CLICK,
      IN_APP_NOTIFICATION_CLOSE, PUSH_RECEIVED, PUSH_SENT, PUSH_CLICK, PUSH_DISMISS];
  }
}
