$(document).ready(function(){

  let _url = "http://my-json-server.typicode.com/rioadrian24/pwa_api/products"

  let dataResults = ""
  let catResults  = ""
  let categories  = []

  function renderPage(data) {

      $.each(data, function(key, items){

        let _cat = items.category

        dataResults += "<div>"
                        + "<h3>" + items.name + "</h3>"
                        + "<p>" + _cat + "</p>"
                       "</div>";

        if ($.inArray(items.category, categories) == -1) {
          categories.push(items.category)
          catResults += "<option value='"+ _cat +"'>"+ _cat +"</option>"
        }

      })

      $('#products').html(dataResults)
      $('#cat_select').html("<option value='all'>Semua</option>" + catResults)

  }

  let networkDataReceived = false

  // Fresh data from online
  let networkUpdate = fetch(_url).then(function(response){
    return response.json()
  }).then(function(data){
    networkDataReceived = true
    renderPage(data)
  })

  // Fresh data from cache
  caches.match(_url).then(function(response){
    return response.json()
  }).then(function(data){
    if (!networkDataReceived) {
      renderPage(data)
      console.log('render data from cache')
    }
  }).catch(function(){
    return networkUpdate
  })

  $('#cat_select').change(function(){

    updateProduct($(this).val())

  })

  function updateProduct(cat) {

    let dataResults = ''
    let _newUrl = _url

    if (cat != 'all')
      _newUrl = _url + "?category=" + cat

    $.get(_newUrl, function(data){

      $.each(data, function(key, items){

        let _cat = items.category

        dataResults += "<div>"
                        + "<h3>" + items.name + "</h3>"
                        + "<p>" + _cat + "</p>"
                      "</div>";

      })

      $('#products').html(dataResults)

    })

  }

})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
