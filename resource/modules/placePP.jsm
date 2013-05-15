moduleAid.VERSION = '1.0.6';

this.__defineGetter__('leftPP', function() { return $(objName+'-left-PP'); });
this.__defineGetter__('rightPP', function() { return $(objName+'-right-PP'); });
this.__defineGetter__('urlbarPP', function() { return $(objName+'-urlbar-PP'); });
this.__defineGetter__('activePP', function() { return (prefAid.inURLBar) ? urlbarPP : (prefAid.movetoRight) ? rightPP : leftPP; });

this.commandPP = function(e) {
	if(e.button != 0) { return; }
	toggleAddonBar();
	dispatch(activePP, { type: 'toggledAddonBarThroughButton', cancelable: false });
};

this.movePPs = function() {
	toggleAttribute(activePP, 'clipped', moveBarStyle.bottom == 1);
	
	var OSoffset = (Services.appinfo.OS != 'WINNT') ? 3 : 8;
	
	styleAid.unload('positionPPs_'+_UUID);
	
	var sscode = '/*The Puzzle Piece CSS declarations of variable values*/\n';
	sscode += '@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\n';
	sscode += '@-moz-document url("'+document.baseURI+'") {\n';
	sscode += '	window['+objName+'_UUID="'+_UUID+'"] #'+objName+'-left-PP { left: '+(moveBarStyle.left -12)+'px; }\n';
	sscode += '	window['+objName+'_UUID="'+_UUID+'"] #'+objName+'-right-PP { right: '+(moveBarStyle.right -12)+'px; }\n';
	sscode += '	window['+objName+'_UUID="'+_UUID+'"] #browser-bottombox .PuzzlePiece { bottom: '+(moveBarStyle.bottom -OSoffset)+'px; }\n';
	sscode += '	window['+objName+'_UUID="'+_UUID+'"] #browser-bottombox .PuzzlePiece:not([customizing]):not([active]):not(:hover) { bottom: '+(moveBarStyle.bottom -OSoffset -19)+'px; }\n';
	sscode += '}';
	
	styleAid.load('positionPPs_'+_UUID, sscode, true);
};

this.choosePP = function() {
	if(!leftPP || !rightPP) {
		listenerAid.add(window, 'loadedAddonBarOverlay', choosePP, false, true);
		return;
	}
	
	toggleAttribute(addonBar, 'movetoright', prefAid.movetoRight);
	leftPP.hidden = prefAid.inURLBar || prefAid.movetoRight;
	rightPP.hidden = prefAid.inURLBar || !prefAid.movetoRight;
	
	activatePPs();
};

this.activatePPs = function() {
	toggleAttribute(activePP, 'active', !addonBar.collapsed);
};

this.customizePP = function(e) {
	toggleAttribute(activePP, 'customizing', (e.type == 'beforecustomization'));
};

moduleAid.LOADMODULE = function() {
	addonBarContextNodes.__defineGetter__('activePP', function() { return activePP; });
	
	listenerAid.add(addonBar, 'WillMoveAddonBar', movePPs);
	listenerAid.add(addonBar, 'ToggledAddonBar', activatePPs);
	listenerAid.add(window, 'beforecustomization', customizePP, false);
	listenerAid.add(window, 'aftercustomization', customizePP, false);
	
	prefAid.listen('movetoRight', choosePP);
	prefAid.listen('inURLBar', choosePP);
	
	choosePP();
	movePPs();
	moveAddonBar(); // Prevents a bug where the add-on bar would be cropped on startup
};

moduleAid.UNLOADMODULE = function() {
	prefAid.unlisten('movetoRight', choosePP);
	prefAid.unlisten('inURLBar', choosePP);
	
	removeAttribute('movetoright');
	leftPP.hidden = true;
	rightPP.hidden = true;
	
	listenerAid.remove(addonBar, 'WillMoveAddonBar', movePPs);
	listenerAid.remove(addonBar, 'ToggledAddonBar', activatePPs);
	listenerAid.remove(window, 'beforecustomization', customizePP, false);
	listenerAid.remove(window, 'aftercustomization', customizePP, false);
	
	delete addonBarContextNodes.activePP;
	
	styleAid.unload('positionPPs_'+_UUID);
};
