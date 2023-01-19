
namespace core {

  function addLinkEvents() {

    // Remove all events and then add it bellow
    $("ul>li>a").off("click");
    $("ul>li>a").off("mouseover");

    // loop through each anchor tag in the unordered list and 
    // add an event listener / handler to allow for 
    // content injection
    $("ul>li>a").on("click", function () {
      loadLink($(this).attr("id"));
    });

    // make it look like each nav item is an active link
    $("ul>li>a").on("mouseover", function () {
      $(this).css('cursor', 'pointer');
    });
  }

  /**
   *This function highligh active link in nav bar
   *
   * @param {string} link
   * @param {string} [data=""]
   */
  function highlightActiveLink(link:string, data:string = ""):void
  {
    $(`#${router.ActiveLink}`).removeClass("active"); // removes highlighted link

    // Swap active link
    if (link == "logout") {
      sessionStorage.clear();
      router.ActiveLink = "login";

    }
    else {
      router.ActiveLink = link;
      router.LinkData = data;
    }
    $(`#${router.ActiveLink}`).addClass("active"); // applies highlighted link to new page
  }

  /**
   * This function switches page content relative to the link that is passed into the function
   * optionally, link data can be also be passed 
   *
   * @param {string} link
   * @param {string} [data=""]
   */
  function loadLink(link: string, data: string = ""): void {

    highlightActiveLink(link, data);
    loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));
    history.pushState({}, "", router.ActiveLink); // this replaces the url displayed in the browser
  }


  /**
   * Inject the Navigation bar into the Header element and highlight the active link based on the pageName parameter
   *
   * @param {string} pageName
   */
  function loadHeader(pageName: string): void {
    // inject the Header
    $.get("./Views/components/header.html", function (data) {
      $("header").html(data); // load the navigation bar

      $(`#${pageName}`).addClass("active"); // highlight active link

      addLinkEvents();

    });
  }

  /**
   * Inject page content in the main element 
   *
   * @param {string} pageName
   * @param {Function} callback
   * @returns {void}
   */
  function loadContent(pageName: string, callback: Function): void {
    // inject content
    $.get(`./Views/content/${pageName}.html`, function (data) {
      $("main").html(data);

      toggleLogin(); // add login / logout and secure links

      callback();
    });

  }

  /**
   * This function loads the page footer
   *
   */
  function loadFooter(): void {
    // inject the Footer
    $.get("./Views/components/footer.html", function (data) {
      $("footer").html(data);
    });
  }

  function displayHome(): void {
    

  }

  function displayAbout(): void {

  }

  function displayProjects(): void {

  }

  function displayServices(): void {

  }

  function testFullName(): void {
    let messageArea = $("#messageArea").hide();
    let fullNamePattern = /([A-Z][a-z]{1,25})+(\s|,|-)([A-Z][a-z]{1,25})+(\s|,|-)*/;


    $("#fullName").on("blur", function () {
      if (!fullNamePattern.test($(this).val().toString())) {
        $(this).trigger("focus").trigger("select");
        messageArea.show().addClass("alert alert-danger").text("Please enter a valid Full Name. This must include at least a Capitalized first name followed by a Capitlalized last name.");
      }
      else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  function testContactNumber(): void {
    let messageArea = $("#messageArea");
    let contactNumberPattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    $("#contactNumber").on("blur", function () {
      if (!contactNumberPattern.test($(this).val().toString())) {
        $(this).trigger("focus").trigger("select");
        messageArea.show().addClass("alert alert-danger").text("Please enter a valid Contact Number. Country code and area code are both optional");
      }
      else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  function testEmailAddress(): void {
    let messageArea = $("#messageArea");
    let emailAddressPattern = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

    $("#emailAddress").on("blur", function () {
      if (!emailAddressPattern.test($(this).val().toString())) {
        $(this).trigger("focus").trigger("select");
        messageArea.show().addClass("alert alert-danger").text("Please enter a valid Email Address.");
      }
      else {
        messageArea.removeAttr("class").hide();
      }
    });
  }

  function formValidation(): void {
    testFullName();
    testContactNumber();
    testEmailAddress();
  }

  function displayContact(): void {
    // form validation
    formValidation();

    $("#sendButton").on("click", (event) => {
      event.preventDefault();
      let subscribeCheckbox = $("#subscribeCheckbox")[0] as HTMLInputElement;
      let fullName = $("#fullName")[0] as HTMLInputElement;
      let contactNumber = $("#contactNumber")[0] as HTMLInputElement;
      let emailAddress = $("#emailAddress")[0] as HTMLInputElement;

      if (subscribeCheckbox.checked) {
        let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);

        if (contact.serialize()) {
          let key = contact.FullName.substring(0, 1) + Date.now();

          localStorage.setItem(key, contact.serialize());
        }
      }
    });
  }

  function displayContactList(): void {
    // don't allow visitors to go here
    authGuard();

    if (localStorage.length > 0) {

      let contactList = document.getElementById("contactList");

      let data = "";

      let keys = Object.keys(localStorage);

      let index = 1;

      for (const key of keys) {
        let contactData = localStorage.getItem(key);

        let contact = new core.Contact();
        contact.deserialize(contactData);

        data += `<tr>
          <th scope="row" class="text-center">${index}</th>
          <td>${contact.FullName}</td>
          <td>${contact.ContactNumber}</td>
          <td>${contact.EmailAddress}</td>
          <td class="text-center"><button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-edit fa-sm"></i> Edit</button></td>
          <td class="text-center"><button value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i> Delete</button></td>
          </tr>`;

        index++;
      }

      contactList.innerHTML = data;

      $("button.edit").on("click", function () {
        loadLink("edit", $(this).val().toString());
      });

      $("button.delete").on("click", function () {
        if (confirm("Are you sure?")) {
          localStorage.removeItem($(this).val().toString());
        }
        loadLink("contact-list"); // refresh the page
      });

      $("#addButton").on("click", function () {
        loadLink("edit");
      });
    }
  }

  function displayEdit(): void {
    let key = router.LinkData;

    let contact = new core.Contact();

    // check to ensure that the key is not empty
    if (key != "") {
      // get contact info from localStorage
      contact.deserialize(localStorage.getItem(key));

      // display contact information in the form
      $("#fullName").val(contact.FullName);
      $("#contactNumber").val(contact.ContactNumber);
      $("#emailAddress").val(contact.EmailAddress);
    }
    else {
      // modify the page so that it shows "Add Contact" in the header 
      $("main>h1").text("Add Contact");
      // modify edit button so that it shows "Add" as well as the appropriate icon
      $("#editButton").html(`<i class="fas fa-plus-circle fa-lg"></i> Add`);
    }

    // form validation
    formValidation();

    $("#editButton").on("click", function () {
      // check to see if key is empty
      if (key == "") {
        // create a new key
        key = contact.FullName.substring(0, 1) + Date.now();
      }

      // copy contact info from form to contact object
      contact.FullName = $("#fullName").val().toString();
      contact.ContactNumber = $("#contactNumber").val().toString();
      contact.EmailAddress = $("#emailAddress").val().toString();

      // add the contact info to localStorage
      localStorage.setItem(key, contact.serialize());

      // return to the contact list
      loadLink("contact-list");

    });

    $("#cancelButton").on("click", function () {
      // return to the contact list
      loadLink("contact-list");
    });
  }

  function displayLogin(): void {
    let messageArea = $("#messageArea");
    messageArea.hide();

    $("#loginButton").on("click", function () {
      let username = $("#username");
      let password = $("#password");
      let success = false;
      let newUser = new core.User();

      // use ajax to access the json file
      $.get("./Data/users.json", function (data) {
        // check each user in the users.json file  (linear search)
        for (const user of data.users) {
          if (username.val() == user.Username && password.val() == user.Password) {
            newUser.fromJSON(user);
            success = true;
            break;
          }
        }

        // if username and password matches - success... then perform login
        if (success) {
          // add user to session storage
          sessionStorage.setItem("user", newUser.serialize());

          // hide any error message
          messageArea.removeAttr("class").hide();

          // redirect user to secure area - contact-list.html
          loadLink("contact-list");
        }
        else {
          // display an error message
          username.trigger("focus").trigger("select");
          messageArea.show().addClass("alert alert-danger").text("Error: Invalid login information");
        }
      });
    });

    $("#cancelButton").on("click", function () {
      // clear the login form
      document.forms[0].reset();
      // return to the home page
      loadLink("home");
    });
  }

  function displayRegister(): void {

  }

  function toggleLogin(): void {

    let contactListLink = $("#contactListLink")[0]; //Check if contact list exist
    // if user is logged in
    if (sessionStorage.getItem("user")) {
      // swap out the login link for logout
      $("#loginListItem").html(
        `<a id="logout" class="nav-link" aria-current="page"><i class="fas fa-sign-out-alt"></i> Logout</a>`
      );

      
      if (!contactListLink) {
        $(`<li id="contactListLink" class="nav-item">
        <a id="contact-list" class="nav-link" aria-current="page"><i class="fas fa-users fa-lg"></i> Contact List</a>
      </li>`).insertBefore("#loginListItem");
      }


    }
    else {
      // swap out the login link for logout
      $("#loginListItem").html(
        `<a id="login" class="nav-link" aria-current="page"><i class="fas fa-sign-in-alt"></i> Login</a>`
      );

      if (contactListLink) {
        $("#contactListLink").remove();
        
      }

    }
    addLinkEvents();
  }

  function authGuard(): void {
    if (!sessionStorage.getItem("user")) {
      // redirect back to login page
      loadLink("login");
    }
  }

  function display404(): void {

  }

  /**
   * This function associates and returns a related callback to a route
   *
   * @param {string} activeLink
   * @returns {Function}
   */
  function ActiveLinkCallBack(activeLink: string): Function {
    switch (activeLink) {
      case "home": return displayHome;
      case "about": return displayAbout;
      case "projects": return displayProjects;
      case "services": return displayServices;
      case "contact": return displayContact;
      case "contact-list": return displayContactList;
      case "edit": return displayEdit;
      case "login": return displayLogin;
      case "register": return displayRegister;
      case "404": return display404;
      default:
        console.error("ERROR: callback does not exist: " + activeLink);
        break;
    }
  }

  /**
   * This is the entry point for our program
   *
   */
  function Start(): void {
    console.log("App Started...");

    loadHeader(router.ActiveLink);

    loadContent(router.ActiveLink, ActiveLinkCallBack(router.ActiveLink));

    loadFooter();
  }

  window.addEventListener("load", Start);

}