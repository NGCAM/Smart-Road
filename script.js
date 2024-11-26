$(document).ready(function() {
  const $container = $('#container');
  const $content = $('#content');
  const $zoomLevel = $('#zoom-level');
  const $zoomSlider = $('#zoom-slider');
  const activeColor = "#13b9f1";
  const inactiveColor = "#E2E3E5";
  let scale = 0.1; // スケール初期値を10%に設定

  // ページ読み込み時にコンテンツの中央にスクロール 
  const containerWidth = $container.width();
  const containerHeight = $container.height();
  
  const contentWidth = $content.get(0).scrollWidth;
  const contentHeight = $content.get(0).scrollHeight;
  
  // 中央にスクロール
  function scrollToCenter() {
    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;
    $container.scrollLeft((scaledWidth - containerWidth) / 2);
    $container.scrollTop((scaledHeight - containerHeight) / 2);
  }
  
  scrollToCenter(); // ページ読み込み時に中央にスクロール

  let isDragging = false;
  let startX, startY, scrollLeft, scrollTop;

  // マウスによるドラッグ開始イベント
  $container.on('mousedown', function(e) {
    isDragging = true;
    $container.css('cursor', 'grabbing');

    // 初期位置の設定
    startX = e.pageX - $container.offset().left;
    startY = e.pageY - $container.offset().top;
    scrollLeft = $container.scrollLeft();
    scrollTop = $container.scrollTop();
  });

  // マウスによるドラッグ移動イベント
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

  // マウスによるドラッグ終了イベント
  $container.on('mouseup mouseleave', function() {
    isDragging = false;
    $container.css('cursor', 'grab');
  });

  // タッチデバイスでのスワイプ開始イベント
  $container.on('touchstart', function(e) {
    isDragging = true;

    const touch = e.touches[0]; // 最初のタッチイベントを取得
    startX = touch.pageX - $container.offset().left;
    startY = touch.pageY - $container.offset().top;
    scrollLeft = $container.scrollLeft();
    scrollTop = $container.scrollTop();
  });

  // タッチデバイスでのスワイプ移動イベント
  $container.on('touchmove', function(e) {
    if (!isDragging) return;

    const touch = e.touches[0]; // 最初のタッチイベントを取得
    const x = touch.pageX - $container.offset().left;
    const y = touch.pageY - $container.offset().top;

    // ドラッグした距離をスクロール量に変換
    const walkX = x - startX;
    const walkY = y - startY;

    $container.scrollLeft(scrollLeft - walkX);
    $container.scrollTop(scrollTop - walkY);
  });

  // タッチデバイスでのスワイプ終了イベント
  $container.on('touchend touchcancel', function() {
    isDragging = false;
  });

  // スケールを更新する関数
  function updateScale(newScale) {
    const prevScale = scale; // 現在のスケールを保持
    scale = newScale;
    
    // コンテンツのサイズをスケールに応じて調整
    const scaledWidth = contentWidth * scale;
    const scaledHeight = contentHeight * scale;
    
    $content.css({
      'transform': 'scale(' + scale + ')',
      'width': scaledWidth + 'px',
      'height': scaledHeight + 'px'
    });

    // 現在のスクロール位置を基に、拡大率変更後も中央に寄せる計算
    const scrollLeft = $container.scrollLeft();
    const scrollTop = $container.scrollTop();
    const containerCenterX = scrollLeft + containerWidth / 2;
    const containerCenterY = scrollTop + containerHeight / 2;

    // 新しいスクロール位置を計算して中央を維持
    const newScrollLeft = (containerCenterX / prevScale) * scale - containerWidth / 2;
    const newScrollTop = (containerCenterY / prevScale) * scale - containerHeight / 2;

    $container.scrollLeft(newScrollLeft);
    $container.scrollTop(newScrollTop);

    const percentage = Math.round(scale * 100); // 拡大率をパーセンテージに変換
    $zoomLevel.text(percentage + '%');
    $zoomSlider.val(percentage); // スライダーの値を更新

    // スライダーの背景色を変更
    const ratio = (percentage - $zoomSlider.attr("min")) / ($zoomSlider.attr("max") - $zoomSlider.attr("min")) * 100;
    $zoomSlider.css("background", `linear-gradient(0deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`);
  }

  // ズームインボタン
  $('#zoom-in').on('click', function() {
    const newScale = Math.min(1, scale + 0.1); // 最大100%
    updateScale(newScale);
  });

  // ズームアウトボタン
  $('#zoom-out').on('click', function() {
    const newScale = Math.max(0.1, scale - 0.1); // 最小10%
    updateScale(newScale);
  });

  // スライダーでズームをコントロール
  $zoomSlider.on('input', function() {
    const newScale = $(this).val() / 100; // スライダーの値をスケールに変換
    updateScale(newScale);

    // スライダーの背景色を更新
    const ratio = (this.value - this.min) / (this.max - this.min) * 100;
    $(this).css("background", `linear-gradient(0deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`);
  });

  // 初期スケールを10%に設定
  updateScale(0.1);
});

$(document).ready(function() {
  // 切り替えボタンのクリックイベント
  $('#toggle-nav').on('click', function() {
    // シチュエーションナビゲーションが表示されているかどうかを確認
    if ($('#navbar-situation').is(':visible')) {
      // シチュエーションナビゲーションを左にスライドして非表示にし、テクノロジーナビゲーションをスライドイン
      $('#navbar-situation').addClass('hidden'); 
      setTimeout(function() {
        $('#navbar-situation').hide(); // アニメーション後に非表示にする
        $('#navbar-technology').show().removeClass('hidden'); // テクノロジーナビゲーションを表示
      }, 500); // アニメーションの時間と同じにする
    } else {
      // テクノロジーナビゲーションを左にスライドして非表示にし、シチュエーションナビゲーションをスライドイン
      $('#navbar-technology').addClass('hidden');
      setTimeout(function() {
        $('#navbar-technology').hide(); // アニメーション後に非表示にする
        $('#navbar-situation').show().removeClass('hidden'); // シチュエーションナビゲーションを表示
      }, 500); // アニメーションの時間と同じにする
    }
  });
});



$(document).ready(function() {
  const $buildingLayer = $('#building-opacity'); // 建物レイヤー
  const $opacitySlider = $('#opacity-slider');
  const $opacityLevel = $('#opacity-level');
  let currentOpacity = 1; // 初期値は100%（1）
  const activeColor = "#13b9f1";
  const inactiveColor = "#E2E3E5";

  // 透明度スライダーの変更に応じて透明度を調整
  $opacitySlider.on('input', function() {
    currentOpacity = $(this).val() / 100;
    $buildingLayer.css('opacity', currentOpacity);
    $opacityLevel.text(Math.round(currentOpacity * 100) + '%');

    // スライダーの背景色を更新
    const ratio = (this.value - this.min) / (this.max - this.min) * 100;
    $(this).css("background", `linear-gradient(0deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`);
  });

  // プラスボタンをクリックして透明度を増加
  $('#opacity-increase').on('click', function() {
    if (currentOpacity < 1) {
      currentOpacity = Math.min(1, currentOpacity + 0.1); // 最大100%
      $opacitySlider.val(currentOpacity * 100);
      $buildingLayer.css('opacity', currentOpacity);
      $opacityLevel.text(Math.round(currentOpacity * 100) + '%');
      
      // スライダーの背景色を更新
      const ratio = (currentOpacity * 100 - $opacitySlider.attr("min")) / ($opacitySlider.attr("max") - $opacitySlider.attr("min")) * 100;
      $opacitySlider.css("background", `linear-gradient(0deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`);
    }
  });

  // マイナスボタンをクリックして透明度を減少
  $('#opacity-decrease').on('click', function() {
    if (currentOpacity > 0) {
      currentOpacity = Math.max(0, currentOpacity - 0.1); // 最小0%
      $opacitySlider.val(currentOpacity * 100);
      $buildingLayer.css('opacity', currentOpacity);
      $opacityLevel.text(Math.round(currentOpacity * 100) + '%');
      
      // スライダーの背景色を更新
      const ratio = (currentOpacity * 100 - $opacitySlider.attr("min")) / ($opacitySlider.attr("max") - $opacitySlider.attr("min")) * 100;
      $opacitySlider.css("background", `linear-gradient(0deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`);
    }
  });

  // 初期値設定と背景色の初期化
  $buildingLayer.css('opacity', currentOpacity);
  $opacityLevel.text('100%');
  const initialRatio = ($opacitySlider.val() - $opacitySlider.attr("min")) / ($opacitySlider.attr("max") - $opacitySlider.attr("min")) * 100;
  $opacitySlider.css("background", `linear-gradient(0deg, ${activeColor} ${initialRatio}%, ${inactiveColor} ${initialRatio}%)`);
});

$(document).ready(function() {
  let currentLayer = 1;

  // 初期状態でレイヤー1のボタンをカレント表示
  $(`.road-toggle-btn[data-layer="${currentLayer}"]`).css({
    'background': '#13B9F1',
    'color': '#FFFFFF' // カレント状態の文字色
  });

  $('.road-toggle-btn').on('click', function() {
    const selectedLayer = $(this).data('layer');

    if (selectedLayer === currentLayer) return; // 同じレイヤーなら何もしない

    // 新しいレイヤーをフェードイン
    $(`#road-layer-${selectedLayer}`).css('display', 'none').fadeIn(300);

    // 現在のレイヤーをフェードアウト
    $(`#road-layer-${currentLayer}`).fadeOut(300);

    // ボタンのスタイルをリセット
    $('.road-toggle-btn').css({
      'background': '#E2E3E5',
      'color': '#13B9F1' // デフォルトの文字色に戻す
    });

    // 選択されたボタンをカレント表示
    $(this).css({
      'background': '#13B9F1',
      'color': '#FFFFFF' // カレント状態の文字色を白に
    });

    // 現在のレイヤーを更新
    currentLayer = selectedLayer;
  });
});


$(document).ready(function() {
  let currentCard = 1; // 初期カードを設定

  // カード切り替えボタンのクリックイベント
  $('.card-toggle-btn').on('click', function() {
    const selectedCard = $(this).data('card');

    if (selectedCard === currentCard) return; // 同じカードなら何もしない

    // 現在のカードを右にスライドアウト
    $(`#card-${currentCard}`).addClass('hidden');

    // 新しいカードを右からスライドイン
    setTimeout(function() {
      $(`#card-${currentCard}`).hide(); // 現在のカードを非表示
      $(`#card-${selectedCard}`).css('display', 'flex').addClass('hidden'); // 新しいカードを非表示位置に置く
      setTimeout(function() {
        $(`#card-${selectedCard}`).removeClass('hidden'); // 新しいカードを表示位置にスライドイン
      }, 10); // 確実にスライドが見えるように少し遅延
      currentCard = selectedCard; // カレントカードを更新
    }, 500); // スライドアウトのアニメーション時間
  });
});


$(document).ready(function() {
  let currentSlide = 0;

  const slides = [
    {
      title: "ようこそ！",
      decoration: "welcome",
      image: "img/tutorial/01.png",
      text: "このサイトでは、未来のSmArt Roadが施工された下北沢の街を体験できます。最新の技術で、道路をアートのキャンバスとして利用し、街の魅力を新しい形で楽しむことができます！",
      buttonText: "次へ",
      closeModal: false
    },
    {
      title: "見る",
      decoration: "Scale & Opacity",
      image: "img/tutorial/02.png",
      text: "『Scale level』を調整して、SmArt Roadの細部を拡大・縮小できます。・『Opacity level』で建物の透明度を自由に変更し、SmArt Roadを注視して見ることができます。細かなディテールや景観の変化をお楽しみください！",
      buttonText: "次へ",
      closeModal: false
    },
    {
      title: "変える",
      decoration: "Road Skin",
      image: "img/tutorial/03.png",
      text: "『Road change』から道路のスキンをお好みに合わせて変更できます。草原、海、宇宙など、8種類の多彩なテーマをお楽しみください！",
      buttonText: "次へ",
      closeModal: false
    },
    {
      title: "知る",
      decoration: "Technology Card",
      image: "img/tutorial/04.png",
      text: "Technology Card を使って、SmArt Roadの各種機能を確認できます。画面上に表示されるアイコンをタッチして、SmArt Roadの可能性と革新性を体験しましょう！",
      buttonText: "体験を始める",
      closeModal: true
    }
  ];

  function updateSlide() {
    $(".tutorial-title .title").text(slides[currentSlide].title);
    $(".tutorial-title .decoration").text(slides[currentSlide].decoration);
    $(".tutorial-image").attr("src", slides[currentSlide].image);
    $(".tutorial-text").text(slides[currentSlide].text);
    $("#next-tutorial").text(slides[currentSlide].buttonText);
  }

  $("#next-tutorial").click(function() {
    if (slides[currentSlide].closeModal) {
      $("#tutorial-modal").fadeOut(300); // モーダルを閉じる
    } else {
      currentSlide = (currentSlide + 1) % slides.length; // 次のスライドへ
      $(".modal-content").fadeOut(300, function() {
        updateSlide();
        $(this).fadeIn(300);
      });
    }
  });

  // 初期スライド設定
  updateSlide();
});
