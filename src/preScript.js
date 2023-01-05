
  module.exports =  async function(context, commands) {
    console.info("inside script file");
    await commands.cache.clear();
   //await commands.cache.clearKeepCookies();
  //  console.log(commands)
    await commands.meta.setTitle('Test Grafana SPA');
    await commands.measure.start('https://www.verizon.com/smartphones/','Gridwall');

    await commands.js.run(abc());
    
  };


  function abc(){
 return 'document.addEventListener("DOMContentLoaded", function(){console.log("hello")})'
}