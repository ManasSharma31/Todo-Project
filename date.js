exports.getDate=function () {

  var today=new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };

  return today.toLocaleDateString(undefined, options);


}
