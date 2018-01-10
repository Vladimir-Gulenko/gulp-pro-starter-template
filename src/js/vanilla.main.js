// General functions
	function log(content){
		console.log(content);
	}

	var hasClass = (element, cls) => (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;

	function addClass(element,cls){
		if( !hasClass(element, cls) ){
			let empty = '';
			if(element.classList.value != "") empty = ' ';
			element.className += empty + cls;
		}
	}

	function removeClass(element, cls){
		if( hasClass(element, cls) ) element.classList.remove(cls);
	}

	function toggleClass(element, cls){
		hasClass(element, cls) ? removeClass(element, cls) : addClass(element, cls);
	}

	var exists = element => typeof(element) != 'undefined' && element != null;

(function(){
	document.addEventListener("DOMContentLoaded", function(){

		const themePrefix = '';

		class Modal {
			constructor(){

				// Prefix for modal class
				this.prefix = '';

				// Name of modal class
				this.name = `${this.prefix}modal`;

				// All modals
				this.modals = document.querySelectorAll(`.${this.name}`);

				// Open Buttons
				this.buttons = document.querySelectorAll(`[data-action="${this.name}"]`);

				// Close Button(`x`)
				this.closeButtons = document.querySelectorAll(`[data-close="${this.name}"]`);

				this.buttons.forEach( (button) => {
					button.addEventListener('click', (e) => this.showButtonClick(e, this));
				});

				this.closeButtons.forEach( (button) => {
					button.addEventListener('click', (e) => this.closeButtonClick(e, this));
				});
			}

			showButtonClick(e) {
				// Get button data-attributes
				var modalData = e.target.dataset;

				// Get attribute data-open and replace # with empty line
				var modalID = modalData.open.replace("#", "");
				
				
				if( exists(document.getElementById(modalID) ) ){

					let modalCurrent = document.getElementById(modalID);

					addClass(document.body, `${this.name}-open`);
					addClass(modalCurrent, `${this.name}_showing_in`);

					// if(modalData.video != undefined){
					// 	let videoSRC = modalData.video;
					// 	let videoWrapper = modalCurrent.getElementsByClassName('v-modal__video')[0];

					// 	videoWrapper.innerHTML = '';

					// 	let videoIframe = document.createElement('iframe');

					// 	addClass(videoIframe, 'v-modal__iframe');
					// 	videoIframe.setAttribute('src', videoSRC);
					// 	videoWrapper.appendChild(videoIframe);
					// }

				}else{
					console.error('No element with ID: ' + modalID);
				}
			}

			modalClose(el){
				removeClass(el, `${this.name}_showing_in`);
				removeClass(document.body, `${this.name}-open`);
			}

			closeButtonClick(e) {
				this.modalClose( e.target.closest(`.${this.name}`) );
			}
		}

		new Modal();
		//console.log(new Modal());

		

		// Modal Window initialization
		// let themeModal = `${themePrefix}modal`;
		// let modalBtn = document.querySelectorAll(`[data-action="${themeModal}"]`);
		// let modalBtnL = modalBtn.length;

		// const modal = document.querySelectorAll(`.${themeModal}`);
		// const modalL = modal.length;

		// const modalBtnClose = document.querySelectorAll(`[data-close="${themeModal}"]`);
		// const modalBtnCloseL = modalBtnClose.length;

		
		// function modalClose(el){
		// 	removeClass(el, `${themeModal}_showing_in`);
		// 	removeClass(document.body, `${themeModal}-open`);
		// 	// if(el.getElementsByClassName('vmodal__video')[0]){
		// 	// 	el.getElementsByClassName('vmodal__video')[0].innerHTML = '';
		// 	// }
		// }
		// function getEventTarget(e){
		// 	var targ;
	
		// 	if (e.target) { // W3C
		// 		targ = e.target;
		// 	}else if (e.srcElement) { // IE6-8
		// 		targ = e.srcElement;
		// 	}else if(e.originalTarget){
		// 		targ = e.originalTarget;
		// 	}
		// 	if (targ.nodeType == 3) { // Safari
		// 		targ = targ.parentNode;
		// 	}
		// 	return targ;
		// }
		// function bodyClick(e){
		// 	let target = getEventTarget(e);
		// 	for(let i = 0; i < modalL; i++){
		// 		if (target == modal[i]) {
		// 			modalClose(modal[i]);
		// 		}
		// 	}
		// }
		// for(var i = 0; i < modalBtnL; i++){
		// 	modalBtn[i].addEventListener('click', function(){

				// // Get button data-attributes
				// var modalData = this.dataset;

				// // Get attribute data-open and replace # with empty line
				// var modalID = modalData.open.replace("#", "");
				
				
				// if( exists(document.getElementById(modalID) ) ){

				// 	let modalCurrent = document.getElementById(modalID);

				// 	addClass(document.body, `${themeModal}-open`);
				// 	addClass(modalCurrent, `${themeModal}_showing_in`);

				// 	// if(modalData.video != undefined){
				// 	// 	let videoSRC = modalData.video;
				// 	// 	let videoWrapper = modalCurrent.getElementsByClassName('v-modal__video')[0];

				// 	// 	videoWrapper.innerHTML = '';

				// 	// 	let videoIframe = document.createElement('iframe');

				// 	// 	addClass(videoIframe, 'v-modal__iframe');
				// 	// 	videoIframe.setAttribute('src', videoSRC);
				// 	// 	videoWrapper.appendChild(videoIframe);
				// 	// }

				// }else{
				// 	console.error('No element with ID: ' + modalID);
				// }

		// 	});
		// }
		
		// for(let i = 0; i < modalBtnCloseL; i++){
		// 	modalBtnClose[i].addEventListener('click', function(){
		// 		modalClose(this.closest(`.${themeModal}`));
		// 	});
		// }
		
		// let bodyEvents = ['click', 'touchstart'];
		// let bodyEventsL = bodyEvents.length;

		// for(let i = 0; i < bodyEventsL; i++){
		// 	document.body.addEventListener(bodyEvents[i], function(e) {
		// 		bodyClick(e);
		// 	}, false);
		// }
	});
}());