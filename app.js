const view = new (require('./view'))();
const lcu_conn = new (require('./lcu/lcu-connector'))();
const lcu_session_det = new (require('./lcu/lcu-session-detector'))();
const lcu_rune_manager = new (require('./lcu/lcu-rune-manager'))();
const lcu_champ_det = new (require('./lcu/lcu-champion-detector'))();

var conn_data = null;

view.on("put-current-page", (page_id) => {
  console.log("putting current page")
  lcu_rune_manager.putCurrentPage(page_id).then((data) => {
    console.log(data);
  });
});

view.on("set-page", (page) => {
  console.log("setting page", page);
  
  lcu_rune_manager.getCurrentPage().then((data) => {
    lcu_rune_manager.deletePageById(data.id).then(() => {
      lcu_rune_manager.postPage(page).then(() => {
        console.log("postPage")
      })
    });
  });
});

lcu_rune_manager.on("pages-update", (pages) => {
  console.log("pages", pages);
  view.setPagesList(pages);
})

lcu_rune_manager.on("pages-error", () => {
  console.log("pages error");
  view.disablePagesList();
})

lcu_session_det.on("login-session-active", (login_session) => {
  console.log("Session active");
  view.setLCUStatus("online", login_session);
})

lcu_session_det.on("login-session-closed", () => {
  console.log("Session closed");
  view.setLCUStatus("offline");
})

lcu_conn.on('connect', (data) => {
  lcu_session_det.start(data);
  lcu_rune_manager.start(data);
  console.log("LCU: connected", data)
  view.setLCUStatus("connected");
});


lcu_conn.on('disconnect', () => {
  lcu_session_det.stop();
  lcu_rune_manager.stop();
  console.log("LCU: disconnected")
  view.setLCUStatus("disconnected");
});

function init() {
  console.log("LCU: connecting")
  lcu_conn.start();
}

exports = module.exports = { init }