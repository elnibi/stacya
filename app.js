var app = new Vue({
   el: "#app",
   data: {
      title: "",
      birthYear: 2002,  // Tahun kelahiran
      utcDate: "",
      myDate: "",
      yourDate: "",
      bod: "",
      days: "",
      hours: "",
      minutes: "",
      seconds: "",
   },
   methods: {
      countdown: function () {
         const second = 1000;
         const minute = second * 60;
         const hour = minute * 60;
         const day = hour * 24;

         let date = new Date();
         this.utcDate = date.toLocaleString("en-US", {
            timeZone: "Etc/UTC",
         });
         this.myDate = date.toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
         });
         this.yourDate = date.toLocaleString();

         let currentYear = date.getFullYear();
         let age = currentYear - this.birthYear;  // Menghitung usia
         this.title = `Anniversaire de Dinda (${age} ans) à :`;  // Menambahkan usia ke dalam judul

         let current = date.getTime();
         let bod = new Date(`5 December ${currentYear}`).getTime();
         let year = (bod - current) / day < 0 ? currentYear + 1 : currentYear;
         let countDown = new Date(`5 December ${year}`).getTime();

         let that = this;
         setInterval(function () {
            let now = new Date().getTime();
            let distance = countDown - now;

            that.days = Math.floor(distance / day);
            that.hours = Math.floor((distance % day) / hour);
            that.minutes = Math.floor((distance % hour) / minute);
            that.seconds = Math.floor((distance % minute) / second);
         }, second);
      },
   },
   watch: {
      days: function () {
         this.animateChange("#days");
      },
      hours: function () {
         this.animateChange("#hours");
      },
      minutes: function () {
         this.animateChange("#minutes");
      },
      seconds: function () {
         this.animateChange("#seconds");
      }
   },
   methods: {
      animateChange: function (selector) {
         const element = document.querySelector(selector);
         element.classList.add('animate');
         setTimeout(() => {
            element.classList.remove('animate');
         }, 500);
      },
      countdown: function () {
         const second = 1000;
         const minute = second * 60;
         const hour = minute * 60;
         const day = hour * 24;

         let date = new Date();
         this.utcDate = date.toLocaleString("en-US", {
            timeZone: "Etc/UTC",
         });
         this.myDate = date.toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
         });
         this.yourDate = date.toLocaleString();

         let that = this;
         let current = date.getTime();
         let thisYear = date.getFullYear();
         let bod = new Date("5 December " + thisYear).getTime();
         let year = (bod - current) / day < 0 ? thisYear + 1 : thisYear;
         let countDown = new Date("5 December " + year).getTime();

         setInterval(function () {
            let now = new Date().getTime();
            let distance = countDown - now;

            that.days = Math.floor(distance / day);
            that.hours = Math.floor((distance % day) / hour);
            that.minutes = Math.floor((distance % hour) / minute);
            that.seconds = Math.floor((distance % minute) / second);
         }, second);
      },
   },
   beforeMount() {
      this.countdown();
   },
});
