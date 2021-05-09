load(['subText', '../../videor/model/controller'],
		function(SubText, SuperController){
	return class Controller extends SuperController {
		get_file_extention(){ return 'mp3'; }
	}
});