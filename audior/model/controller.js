define(['./subText', './videor/model/controller'], (SubText, SuperController) => {
  return class Controller extends SuperController {
    get_file_extention() { return 'mp3'; }
  }
})
