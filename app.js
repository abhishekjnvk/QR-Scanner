var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({
      video: document.getElementById('preview'),
      scanPeriod: 5
    });
    self.scanner.addListener('scan', function (content, image) {
      self.scans.unshift({
        date: +(Date.now()),
        content: content
      });
      $("#scan_history").prepend(`<li  class='list-group-item border border-secondary mt-2' >  ${content}</li>`);

      //  if content is a url then redirect to that url in new tab
      if (content.includes("http")) {
        window.open(content, '_blank');
      }

      $("#server_message").text('QR Code Scanned');
      $("#server_response").css('background-color', 'green');
      $("#server_response").show();

      setTimeout(() => {
        $("#server_response").hide();
      }, 2000);

      console.log(content);
    });


    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});