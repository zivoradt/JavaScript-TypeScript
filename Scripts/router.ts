

namespace core
{
  export class Router {
    // Instances variables

    private m_activeLink: string;
    private m_routingTable: string[];
    // Constructor
    constructor() {
      this.ActiveLink = "";
    }
    // Public Properties (getters and setters)

    get ActiveLink():string
    {
      return this.m_activeLink;
    }
    set ActiveLink(link:string)
     {
      this.m_activeLink = link;
    }

    // Private methods
    // Public methods
    /**
     *Adding a new route to the Routhing Table
     *
     * @param {string} route
     * @returns {void}
     */
    public Add(route:string) {
      this.m_routingTable.push(route);
    }
    /**
     *This replace the current Routhing Table with a new one
     *Routes should begin with  / character
     * @param {string} routingTable
     * @returns {void}
     */
    public AddTable(routingTable:string[]) 
    {
      this.m_routingTable = routingTable;
    }
    /**
     *This method find the index of the route in the routing table
     *
     * @param {string} route
     * @return {number} 
     */
    public Find(route:string):number
    {
      return this.m_routingTable.indexOf(route);
    }
    /**
     *This method remove a route in the routing table
     *
     * @param {string} route
     * @return {boolean} 
     */
    public Remove(route:string):boolean 
    {
      if (this.Find(route) > -1) {
        this.m_routingTable.splice(this.Find(route), 1);
        return true;
      }
      return false;
    }
    /**
     *This method return the routing table as a comma-separated string
     *
     * 
     * @return {string} 
     */
    public ToString():string
     {
      return this.m_routingTable.toString();
    }
  }
 
}


// TODO need to move code into its own file
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
if (router.Find(route)> -1) {

    if (route == "/") {
        router.ActiveLink = "home";
    }
    else{
        router.ActiveLink = route.substring(1);
    }
}
else{
    router.ActiveLink = "404";
}