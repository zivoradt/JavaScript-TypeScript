"use strict";
var core;
(function (core) {
    class Router {
        constructor() {
            this.ActiveLink = "";
        }
        get ActiveLink() {
            return this.m_activeLink;
        }
        set ActiveLink(link) {
            this.m_activeLink = link;
        }
        Add(route) {
            this.m_routingTable.push(route);
        }
        AddTable(routingTable) {
            this.m_routingTable = routingTable;
        }
        Find(route) {
            return this.m_routingTable.indexOf(route);
        }
        Remove(route) {
            if (this.Find(route) > -1) {
                this.m_routingTable.splice(this.Find(route), 1);
                return true;
            }
            return false;
        }
        ToString() {
            return this.m_routingTable.toString();
        }
    }
    core.Router = Router;
})(core || (core = {}));
let router = new core.Router();
router.AddTable([
    "/",
    "/home",
    "/about",
    "/contact",
    "/edit",
    "/projects",
    "/contact-list",
    "/login",
    "/register",
    "/services",
]);
let route = location.pathname;
console.log(route);
if (router.Find(route) > -1) {
    if (route == "/") {
        router.ActiveLink = "home";
    }
    else {
        router.ActiveLink = route.substring(1);
    }
}
else {
    router.ActiveLink = "404";
}
//# sourceMappingURL=router.js.map