$(document).ready(function() {
  const $container = $('#container');
  const $content = $('#content');
  const $zoomLevel = $('#zoom-level');
  const $zoomSlider = $('#zoom-slider');
  const activeColor = "#13b9f1";
  const inactiveColor = "#E2E3E5";
  let scale = 0.1; // スケールの初期値は10%
  const minScale = 0.1;
  const maxScale = 1.0;
  const zoomStep = 0.1;

  // コンテナとコンテンツの寸法を取得
  const containerWidth = $container.width();
  const containerHeight = $container.height();
  const contentWidth = $content.get(0).scrollWidth;
  const contentHeight = $content.get(0).scrollHeight;

  // 中央にスクロール
  function scrollToCenter() {
    $container.scrollLeft((contentWidth * scale - containerWidth) / 2);
    $container.scrollTop((contentHeight * scale - containerHeight) / 2);
  }

  scrollToCenter(); // 読み込み時にコンテンツを中央に配置

  let isDragging = false, startX, startY, scrollLeft, scrollTop;

  // ドラッグ操作のイベントハンドラ
  const startDrag = (e) => {
    isDragging = true;
    $container.css('cursor', 'grabbing');
    startX = e.pageX || e.touches[0].pageX;
    startY = e.pageY || e.touches[0].pageY;
    scrollLeft = $container.scrollLeft();
    scrollTop = $container.scrollTop();
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    const x = e.pageX || e.touches[0].pageX;
    const y = e.pageY || e.touches[0].pageY;
    $container.scrollLeft(scrollLeft - (x - startX));
    $container.scrollTop(scrollTop - (y - startY));
  };

  const endDrag = () => {
    isDragging = false;
    $container.css('cursor', 'grab');
  };

  $container.on('mousedown touchstart', startDrag)
            .on('mousemove touchmove', onDrag)
            .on('mouseup mouseleave touchend touchcancel', endDrag);

  // スケールを更新する関数
  function updateScale(newScale) {
    const prevScale = scale;
    scale = newScale;

    $content.css({
      'transform': `scale(${scale})`,
      'width': `${contentWidth * scale}px`,
      'height': `${contentHeight * scale}px`
    });

    // ズーム後も中央を維持するようにスクロールを調整
    const scrollLeft = $container.scrollLeft();
    const scrollTop = $container.scrollTop();
    const containerCenterX = scrollLeft + containerWidth / 2;
    const containerCenterY = scrollTop + containerHeight / 2;

    const newScrollLeft = (containerCenterX / prevScale) * scale - containerWidth / 2;
    const newScrollTop = (containerCenterY / prevScale) * scale - containerHeight / 2;

    $container.scrollLeft(newScrollLeft);
    $container.scrollTop(newScrollTop);

    const percentage = Math.round(scale * 100);
    $zoomLevel.text(`${percentage}%`);
    $zoomSlider.val(percentage);
    updateSliderBackground($zoomSlider, percentage);
  }

  // スライダーの背景色を更新
  function updateSliderBackground($slider, value) {
    const ratio = (value - $slider.attr("min")) / ($slider.attr("max") - $slider.attr("min")) * 100;
    $slider.css("background", `linear-gradient(0deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`);
  }

  // マウススクロールによるズーム操作
  $container.on('wheel', function(e) {
    e.preventDefault();
    const delta = e.originalEvent.deltaY;

    if (delta > 0) {
      // ズームアウト
      if (scale > minScale) {
        updateScale(Math.max(minScale, scale - zoomStep));
      }
    } else {
      // ズームイン
      if (scale < maxScale) {
        updateScale(Math.min(maxScale, scale + zoomStep));
      }
    }
  });

  // ズームインボタン
  $('#zoom-in').on('click', function() {
    updateScale(Math.min(maxScale, scale + zoomStep));
  });

  // ズームアウトボタン
  $('#zoom-out').on('click', function() {
    updateScale(Math.max(minScale, scale - zoomStep));
  });

  // スライダーでズームをコントロール
  $zoomSlider.on('input', function() {
    const newScale = $(this).val() / 100;
    updateScale(newScale);
    updateSliderBackground($(this), $(this).val());
  });

  // 初期スケールの設定
  updateScale(0.1);

  // ナビゲーションの切り替え
  $('#toggle-nav').on('click', function() {
    const $navSituation = $('#navbar-situation');
    const $navTechnology = $('#navbar-technology');
    const isSituationVisible = $navSituation.is(':visible');

    $navSituation.toggleClass('hidden', isSituationVisible);
    $navTechnology.toggleClass('hidden', !isSituationVisible);
    setTimeout(() => {
      $navSituation.toggle(!isSituationVisible);
      $navTechnology.toggle(isSituationVisible);
    }, 500);
  });

  // 透明度のコントロール
  const $buildingLayer = $('#building-opacity');
  const $opacitySlider = $('#opacity-slider');
  const $opacityLevel = $('#opacity-level');
  let currentOpacity = 1;

  $opacitySlider.on('input', function() {
    currentOpacity = $(this).val() / 100;
    $buildingLayer.css('opacity', currentOpacity);
    $opacityLevel.text(`${Math.round(currentOpacity * 100)}%`);
    updateSliderBackground($(this), $(this).val());
  });

  $('#opacity-increase').on('click', () => {
    if (currentOpacity < 1) adjustOpacity(0.1);
  });

  $('#opacity-decrease').on('click', () => {
    if (currentOpacity > 0) adjustOpacity(-0.1);
  });

  function adjustOpacity(value) {
    currentOpacity = Math.min(1, Math.max(0, currentOpacity + value));
    $opacitySlider.val(currentOpacity * 100);
    $buildingLayer.css('opacity', currentOpacity);
    $opacityLevel.text(`${Math.round(currentOpacity * 100)}%`);
    updateSliderBackground($opacitySlider, currentOpacity * 100);
  }

  // レイヤー切り替え
  let currentLayer = 1;
  $('.road-toggle-btn').on('click', function() {
    const selectedLayer = $(this).data('layer');
    if (selectedLayer === currentLayer) return;

    $(`#road-layer-${currentLayer}`).fadeOut(300);
    $(`#road-layer-${selectedLayer}`).hide().fadeIn(300);

    $('.road-toggle-btn').css({'background': inactiveColor, 'color': activeColor});
    $(this).css({'background': activeColor, 'color': '#FFFFFF'});

    currentLayer = selectedLayer;
  });

  // カード切り替え
  let currentCard = 1;
  $('.card-toggle-btn').on('click', function() {
    const selectedCard = $(this).data('card');
    if (selectedCard === currentCard) return;

    $(`#card-${currentCard}`).addClass('hidden');
    setTimeout(() => {
      $(`#card-${currentCard}`).hide();
      $(`#card-${selectedCard}`).css('display', 'flex').hide().removeClass('hidden').fadeIn(300);
      currentCard = selectedCard;
    }, 500);
  });
});
