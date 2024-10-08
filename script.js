$(document).ready(function() {
    const $container = $('#container');
    const $content = $('#content');
  
    // ページ読み込み時にコンテンツの中央にスクロール
    const containerWidth = $container.width();
    const containerHeight = $container.height();
    
    const contentWidth = $content.get(0).scrollWidth;
    const contentHeight = $content.get(0).scrollHeight;
    
    // 中央にスクロール
    $container.scrollLeft((contentWidth - containerWidth) / 2);
    $container.scrollTop((contentHeight - containerHeight) / 2);
  
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
  
    $container.on('mousedown', function(e) {
      isDragging = true;
      $container.css('cursor', 'grabbing');
  
      // 初期位置の設定
      startX = e.pageX - $container.offset().left;
      startY = e.pageY - $container.offset().top;
      scrollLeft = $container.scrollLeft();
      scrollTop = $container.scrollTop();
    });
  
    $container.on('mousemove', function(e) {
      if (!isDragging) return;
  
      e.preventDefault(); // 不要な選択を防ぐ
      const x = e.pageX - $container.offset().left;
      const y = e.pageY - $container.offset().top;
  
      // ドラッグした距離をスクロール量に変換
      const walkX = x - startX;
      const walkY = y - startY;
  
      $container.scrollLeft(scrollLeft - walkX);
      $container.scrollTop(scrollTop - walkY);
    });
  
    $container.on('mouseup mouseleave', function() {
      isDragging = false;
      $container.css('cursor', 'grab');
    });
  });
  

  var $section = $("#auto-contain");
$section
	.find(".panzoom")
	.panzoom({
		startTransform: "scale(0.1)",
		increment: 0.1,
		minScale: 0.5,
		contain: "invert"
	})
	.panzoom("zoom")
	.click(function(e) {
		e.target.classList.toggle('selected');
		console.log(e.target.getAttribute('title'));
});

$(document).ready(function() {
    const $container = $('#container');
    const $content = $('#content');
  
    // ページ読み込み時にコンテンツの中央にスクロール
    const containerWidth = $container.width();
    const containerHeight = $container.height();
    
    const contentWidth = $content.get(0).scrollWidth;
    const contentHeight = $content.get(0).scrollHeight;
    
    // 中央にスクロール
    $container.scrollLeft((contentWidth - containerWidth) / 2);
    $container.scrollTop((contentHeight - containerHeight) / 2);
  
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
  
    $container.on('mousedown', function(e) {
      isDragging = true;
      $container.css('cursor', 'grabbing');
  
      // 初期位置の設定
      startX = e.pageX - $container.offset().left;
      startY = e.pageY - $container.offset().top;
      scrollLeft = $container.scrollLeft();
      scrollTop = $container.scrollTop();
    });
  
    $container.on('mousemove', function(e) {
      if (!isDragging) return;
  
      e.preventDefault(); // 不要な選択を防ぐ
      const x = e.pageX - $container.offset().left;
      const y = e.pageY - $container.offset().top;
  
      // ドラッグした距離をスクロール量に変換
      const walkX = x - startX;
      const walkY = y - startY;
  
      $container.scrollLeft(scrollLeft - walkX);
      $container.scrollTop(scrollTop - walkY);
    });
  
    $container.on('mouseup mouseleave', function() {
      isDragging = false;
      $container.css('cursor', 'grab');
    });
  });
  