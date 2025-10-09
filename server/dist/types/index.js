"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckInStatus = exports.EnrollmentStatus = exports.ClassStatus = exports.LicensePlan = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["COACH"] = "coach";
    UserRole["BRANCH_MANAGER"] = "branch_manager";
    UserRole["SYSTEM_MANAGER"] = "system_manager";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING"] = "pending";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var LicensePlan;
(function (LicensePlan) {
    LicensePlan["TRIAL"] = "trial";
    LicensePlan["BASIC"] = "basic";
    LicensePlan["PROFESSIONAL"] = "professional";
    LicensePlan["ENTERPRISE"] = "enterprise";
})(LicensePlan || (exports.LicensePlan = LicensePlan = {}));
var ClassStatus;
(function (ClassStatus) {
    ClassStatus["SCHEDULED"] = "scheduled";
    ClassStatus["ONGOING"] = "ongoing";
    ClassStatus["COMPLETED"] = "completed";
    ClassStatus["CANCELLED"] = "cancelled";
})(ClassStatus || (exports.ClassStatus = ClassStatus = {}));
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["PENDING"] = "pending";
    EnrollmentStatus["CONFIRMED"] = "confirmed";
    EnrollmentStatus["CANCELLED"] = "cancelled";
    EnrollmentStatus["COMPLETED"] = "completed";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
var CheckInStatus;
(function (CheckInStatus) {
    CheckInStatus["PRESENT"] = "present";
    CheckInStatus["ABSENT"] = "absent";
    CheckInStatus["LATE"] = "late";
    CheckInStatus["EXCUSED"] = "excused";
})(CheckInStatus || (exports.CheckInStatus = CheckInStatus = {}));
//# sourceMappingURL=index.js.map