const { EventEmitter } = require('events');

var lcu_badge = $("#lcu-conn-status");

$('[data-toggle="tooltip"]').mouseup(function() { this.blur() })
$('.chosen-container').mouseup(function() { this.blur() })

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});



function compare_order(a, b) {
	if (a.order < b.order) return -1;
	if (a.order > b.order) return 1;
	return 0;
}

class View extends EventEmitter {
	
	constructor() {
		super();

		this._status = "disconnected";

		var self = this;
		$(function() {
			$("#lcu-pages-list").chosen({
				disable_search_threshold: 2,
				no_results_text: "No results",
				width: "100%"
			}).change(function() {
				self.setLoadingItem($(this).val());
				self.emit("put-current-page", $(this).val());
			});

			$(".btn-set-page").click(function() {
				var page = $(this).data("page");
				self.emit("set-page", page);
				self.addTempPage(page);
			});
		});
	}

	setLCUStatus(status, login_session) {
		if(status == "online") {
			lcu_badge.attr("class", "badge badge-pill badge-light")
			lcu_badge.text("ONLINE")
			lcu_badge.attr("data-original-title", `Welcome, ${login_session.username}!`)
		}
		else if(status == "offline" && this._status != "disconnected") {
			lcu_badge.attr("class", "badge badge-pill badge-light")
			lcu_badge.text("OFFLINE")
			lcu_badge.attr("data-original-title", `No session found.`)
		}
		else if(status == "connected") {
			lcu_badge.attr("class", "badge badge-pill badge-light")
			lcu_badge.text("OFFLINE")
			lcu_badge.attr("data-original-title", `Please login to the League Client to sync with RuneBook.`)
		}
		else if(status == "disconnected") {
			lcu_badge.attr("class", "badge badge-pill badge-light")
			lcu_badge.text("CLOSED")
			lcu_badge.attr("data-original-title", `Please open your League Client to continue using RuneBook.`)
		}

		this._status = status;
	}

	setPagesList(pages) {
		pages.sort(compare_order);
		var res = "";
		for(var i = 0; i < pages.length; i++) {
			var page = pages[i];
			res += `<option ${page.current ? "selected" : ""} value="${page.id}" data-page="${JSON.stringify(page)}">${page.name} ${page.current ? "&#10003;" : ""}</option>`;
		}
		$("#lcu-pages-list").html(res);
		$("#lcu-pages-list").prop("disabled", false);
		$("#lcu-pages-list").trigger("chosen:updated");

		$(".btn-set-page").prop("disabled", false);
	}

	disablePagesList() {
		$("#lcu-pages-list").html("");
		$("#lcu-pages-list").prop("disabled", true);
		$("#lcu-pages-list").trigger("chosen:updated");

		$(".btn-set-page").prop("disabled", true);
	}

	setLoadingItem(val) {
		$(`#lcu-pages-list option[value=${val}]`).html(function(i, html) {
			return html + " &#8635;";
		});
		$("#lcu-pages-list").trigger("chosen:updated");
	}

	addTempPage(page) {
		console.log(page)
		$('#lcu-pages-list').html(function(i, html) {
			return `<option value="temp-id" data-page="${page}">${page.name} &#8635;</option>` + html;
		});
		$("#lcu-pages-list").val("temp-id");
		$("#lcu-pages-list").trigger("chosen:updated");
	}
}

exports = module.exports = View