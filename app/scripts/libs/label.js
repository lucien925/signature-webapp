$(function() {
	'use strict'

	// 选择DOM元素
	var $container = $('.signature-container'),
		$guideLineX = $('.guide-line-x'),
		$guideLineY = $('.guide-line-y'),
		$propsItem = $('.props-item')

	// 全局变量
	var coordinates = {},
		globalCenter = [
			$container.width() / 2,
			$container.height() / 2
		],
		guideLines = [],
		resistanceTimer = null,
		resistance = false,
		$dragEle = null


	init()

	$container.on({
		dragover: function(e) {
			e.preventDefault()
			var $this = $(this)
			$this.addClass('over')
		},
		dragleave: function(e) {
			var $this = $(this)
			$this.removeClass('over')
		},
		drop: function(e) {
			var $this = $(this),
				$dragEleClone, coordinate, uid
			e.preventDefault()
			$this.removeClass('over')
			if($dragEle) {
				$dragEleClone = $dragEle.clone()
				$dragEleClone.draggable({
					drag: handleLabelDrag,
					stop: handleLabelStop
				})
				$container.append($dragEleClone)
				coordinate = getCoordinate($dragEleClone)
				uid = helper.generateUID()
				coordinates[uid] = coordinate
			}
		}
	})
	// 初始化函数
	function init() {
		var $labels = $container.find('[data-role="label"]'),
			coordinate
		$propsItem.on('dragstart', function() {
			$dragEle = $(this)
		})
		$labels.each(function(label) {
			var $this = $(this),
				uid = helper.generateUID()
			coordinate = getCoordinate($this)
			coordinates[uid] = coordinate

			$this.data('uid', uid)
			// 给签名面板的控件加上拖拽
			$this.draggable({
				drag: handleLabelDrag,
				stop: handleLabelStop
			})
		})
	}

	// 生成签名面板内被拖拽的控件的位置信息
	// 依赖全局变量 globalCenter
	function getCoordinate($ele) {
		var _width = $ele.width(),
			_height = $ele.height(),
			_position = $ele.position(),
			_center = {
				x: (_width / 2) + _position.left,
				y: (_height / 2) + _position.top
			}
		console.log(_position)
		// 按照出现辅助线的优先级定义坐标在数组中的位置
		// 如果优先级高的坐标点匹配出现辅助线，那么后面
		// 优先级的坐标点就不进行匹配
		var coordinate = [
				[_center.x, _center.y], // center
				[_position.left, _position.top], //left-top
				[_position.left + _width, _position.top], // right-top
				[_position.left, _position.top + _height], // left-bottom
				[_position.left + _width, _position.top + _height]  // right-bottom
			]
		
		return coordinate
	}

	// 处理签名面板的拖拽控件拖拽的处理函数
	// 依赖全局变量 coordinates、guideLines
	function handleLabelDrag(e, ui) {
		
		guideLines.length = 0
		// 隐藏X、Y轴辅助线
		$guideLineX.hide()
		$guideLineY.hide()
		
		var $target = $(e.target),
			uid = $target.data('uid')
		coordinates[uid] = getCoordinate($target)

		for(var id in coordinates) {
			if(id === uid) continue
				
			for(var i = 0, lenI = coordinates[uid].length; i < lenI; i++) {
				var outer = coordinates[uid][i]
				for(var j = 0, lenJ = coordinates[id].length; j < lenJ; j++ ) {
					var inner = coordinates[id][j],
						guideLine = {}

					if(outer[0] === inner[0]) {
						guideLine.dir = 'x'
						guideLine.position = inner[0]
						guideLines.push(guideLine)
					}
					if(outer[1] === inner[1]) {
						guideLine.dir = 'y'
						guideLine.position = inner[1]
						guideLines.push(guideLine)
							
					}
					// 生成辅助线	
					if(guideLines.length > 0) {
						resistance = true
						generateGuideLine()
					}

				}
			}
		}

	}
	function handleLabelStop() {
		$guideLineX.hide()
		$guideLineY.hide()
	}
	// 依赖全局变量 guideLines
	function generateGuideLine() {
		var style = '',
			i = 0, len = guideLines.length,
			guideLine
		for(; i < len; i++) {
			guideLine = guideLines[i]
			if(guideLine.dir === 'x') {
				$guideLineX.css({
					display: 'block',
					left: guideLine.position
				})
			}
			if(guideLine.dir === 'y') {
				$guideLineY.css({
					display: 'block',
					top: guideLine.position
				})
			}
		}

	}

})