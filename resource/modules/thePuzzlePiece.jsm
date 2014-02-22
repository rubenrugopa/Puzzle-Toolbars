moduleAid.VERSION = '1.1.4';

this.__defineGetter__('bottomBox', function() { return $('browser-bottombox'); });
this.__defineGetter__('addonBar', function() { return (!Australis) ? $('addon-bar') : $(objName+'-addon-bar'); });

this.showWhenMigrated = function() {
	if(oldBarMigrated) {
		if(addonBar.collapsed) {
			toggleAddonBar();
		}
		
		oldBarMigrated = false;
	}
};

this.toggleAutoHide = function() {
	moduleAid.loadIf('autoHide', prefAid.placement != 'bottom' && prefAid.autoHide);
};

this.togglePlacement = function(e) {
	// I can't drag from the add-on bar when it's in the url bar, it only drags the whole url bar in this case
	var customizing = (e && e.type == 'beforecustomization') || trueAttribute(addonBar, 'customizing');
	
	if(!customizing && addonBar.parentNode.id == 'customization-palette-container') {
		bottomBox.insertBefore(addonBar, $('developer-toolbar'));
	}
	
	moduleAid.loadIf('inURLBar', !customizing && prefAid.placement == 'urlbar');
	setAttribute(addonBar, 'placement', (!customizing) ? prefAid.placement : 'bottom');
	
	if(customizing && addonBar.parentNode.id != 'customization-palette-container') {
		$('customization-palette-container').appendChild(addonBar);
	}
};

moduleAid.LOADMODULE = function() {
	moduleAid.load('compatibilityFix/windowFixes');
	moduleAid.load('initAddonBar');
	moduleAid.load('placePP');
	
	listenerAid.add(window, 'beforecustomization', togglePlacement);
	listenerAid.add(window, 'aftercustomization', togglePlacement);
	
	prefAid.listen('autoHide', toggleAutoHide);
	prefAid.listen('placement', toggleAutoHide);
	prefAid.listen('placement', togglePlacement);
	
	togglePlacement();
	toggleAutoHide();
	
	if(Australis) {
		listenerAid.add(window, 'MigratedFromAddonBar', showWhenMigrated);
		showWhenMigrated();
	}
};

moduleAid.UNLOADMODULE = function() {
	prefAid.unlisten('autoHide', toggleAutoHide);
	prefAid.unlisten('placement', toggleAutoHide);
	prefAid.unlisten('placement', togglePlacement);
	
	if(Australis) {
		listenerAid.remove(window, 'MigratedFromAddonBar', showWhenMigrated);
	}
	
	listenerAid.remove(window, 'beforecustomization', togglePlacement);
	listenerAid.remove(window, 'aftercustomization', togglePlacement);
	
	removeAttribute(addonBar, 'placement');
	
	moduleAid.unload('autoHide');
	moduleAid.unload('inURLBar');
	moduleAid.unload('placePP');
	moduleAid.unload('initAddonBar');
	moduleAid.unload('compatibilityFix/windowFixes');
};
