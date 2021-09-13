Vue.createApp({
  data() {
    return {
      title: "My ToDo Manager",
      td_title: "",
      td_new: true,
      //false state for new/uncompleted, true for completed,
      isPopulated: false,
      todos: [],
      mountRegForm: true,
      user_name: "",
      user_email: "",
      errors: "",
      isLogged: false,
      isEditting: null,
      allTDs: []
    }
  },
  methods: {
    addNewTD(e) {
      if (this.td_title.length !== 0) {
        if (this.isEditting === null) {
          this.isPopulated = true,
          this.fetchStorage()
          this.todos.push({
            td_title: this.td_title,
            td_new: true
          })
          this.updateStorage()
          this.fetchStorage()
        } else {
          this.todos[this.isEditting].td_title = this.td_title
          this.isEditting = null
          this.updateStorage()
          this.fetchStorage()
        }
      } else {
        this.errors = "Field cannot be empty"
        return
      }
      this.td_title = ""
      this.errors = ""
    },
    // For development aid
    close() {
      this.mountRegForm = false;
    },
    regLogEmail() {
      if (!localStorage.isLogged) {
        if (!this.user_email || !this.user_name) {
          this.errors = ""
          this.errors = "All fields must be filled to continue"
          return;
        }
        let regEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
        if (this.user_name.length < 3 || this.user_name.length > 10) {
          this.errors = ""
          this.errors = "Name should be between 3 & 10 characters"
        } else if (regEx.test(this.user_email)) {
          this.isLogged = true;
          localStorage.isLogged = this.isLogged;
          localStorage.user_name = this.user_name;
          localStorage.user_email = this.user_email;
          this.mountRegForm = false
          this.errors = ""
        } else {
          this.errors = ""
          this.errors = "Email invalid, please try again"
          return
        }
      } else if (localStorage.isLogged) {
        if (this.user_email != localStorage.user_email) {
          this.errors += `Incorrect email for user ${this.user_name}, pelase try again.`
          return
        } else {
          this.mountRegForm = false
          this.errors = ""
        }
      }

    },
    deleteTd(index) {
      if (confirm("Sure about that?")) {
        this.todos.splice(index, 1)
      }
      this.updateStorage()
      this.fetchStorage()
    },
    toggleState(index, e) {
      this.fetchStorage()
      this.todos[index].td_new = !this.todos[index].td_new
      console.log(e)
      if (e.srcElement.parentElement.nextElementSibling.classList.contains("td-new")) {
        e.srcElement.parentElement.nextElementSibling.classList.remove("td-new")
        e.srcElement.parentElement.nextElementSibling.classList.add("td-done")
        this.updateStorage()
      } else {
        e.srcElement.parentElement.nextElementSibling.classList.remove("td-done")
        e.srcElement.parentElement.nextElementSibling.classList.add("td-new")
        this.updateStorage()
      }
    },
    editTD(index) {
      this.td_title = this.todos[index].td_title
      this.isEditting = index
      this.updateStorage()
    },
    fetchStorage() {
      if (localStorage.allTDs) {
        this.todos = JSON.parse(localStorage.allTDs)
        this.isPopulated = true
      } else {
        this.isPopulated = false
      }
    },
    updateStorage() {
      localStorage.allTDs = JSON.stringify(this.todos)
    },
  },
  mounted() {
    if (localStorage.isLogged) {
      this.isPopulated = true
      this.isLogged = true
      this.user_email = localStorage.user_email;
      this.user_name = localStorage.user_name;
    }
    this.fetchStorage()
  }

}).mount("#wrapper")

// For development only
//localStorage.removeItem("allTDs")
//localStorage.removeItem("isLogged")
//localStorage.removeItem("user_name")
//localStorage.removeItem("user_email")