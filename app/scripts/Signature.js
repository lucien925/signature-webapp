$(function() {

	'use strict'
	var CONFIG = {

		textTmpl: '<div class="">' + 
						'<span class=""></span>' + 
						'<span class=""></span>' +
				  '</div>',
		imageTmpl: '<div class="">' +
						'<div class="">' + 
							'<img src="" alt="">' +
						'</div>' +
						'<p></p>' +
					'</div>',
		snapLineXTmpl: '<div class="guide-line-x"></div>',
		snapLineYTmpl: '<div class="guide-line-y"></div>',
		contextMenu: '<ul class="context-menu">' +
						'<li><a data-action="alter" href="javascript:void(0)">修改</a></li>' +
						'<li><a data-action="delete" href="javascript:void(0)">删除</a></li>' +
					 '</ul>'
	}

	function Signature(opts) {
		this.$container = $(opts.container)
		this.data = []
		this.snapLines = []
		this.$focusCtx = null
		this.$snapLineX = $(CONFIG.snapLineXTmpl)
		this.$snapLineY = $(CONFIG.snapLineYTmpl)
		this.$contextMenu = $(CONFIG.contextMenu)
		this.$contextMenuCtx = null
		this.init()
	}

	Signature.prototype.init = function() {
		var $labels = this.$container.find('[data-role="label"]'),
			width = this.$container.width(),
			height = this.$container.height()
		this.globalCenter = [width / 2, height / 2]
		this.$container.append(this.$snapLineX, this.$snapLineY, this.$contextMenu)
		if($labels.length > 0) {
			this.initStaffs($labels)
		}
	}

	Signature.prototype.initStaffs = function($ele) {
		var self = this
		$ele.each(function(index) {
			var $this = $(this),
				position = $this.position(),
				width = $this.width(),
				height = $this.height(),
				coordinate
			$this.data('index', index)
			coordinate = self._getKeyPlace(width, height, position.left, position.top)
			self._addData(coordinate)
			self._bindEvent($this)
		})

		self.$container.on({
			dragover: function(e) {
				
				self.$container.addClass('over')
			},
			dragleave: function(e) {
				self.$container.removeClass('over')
			},
			drop: function(e) {
				self.$container.removeClass('over')
				// @todo: 处理属性拖拽带绘制面板的逻辑
			},
			click: function(e) {
				self.$contextMenu.hide()
			},
			contextmenu: function(e) {
				e.preventDefault()
				e.stopPropagation()
			}
		})
		self.$container.on('contextmenu', '[data-role="label"]', function(e) {
			e.preventDefault()
			e.stopPropagation()

			var $this = $(this),
				position = $this.position()
			$this.off('mousemove mouseup')
			self.$contextMenuCtx = $this
			position.left += e.offsetX
			position.top += e.offsetY

			self._showContextMenu(position)
		})
		
		self.$contextMenu.on('click', 'a', function() {
			var $target = $(this),
				action = $(this).attr('data-action')
			if(action === 'alter') {

			} else if(action === 'delete') {
				self._deleteEle(self.$contextMenuCtx)
			}

		})
	}

	Signature.prototype._getKeyPlace = function(w, h, l, t) {

		return [
			l + (w / 2),		//   center-x
			t + (h / 2),		//	 center-y
			t,					//	 top
			t + h,				//	 bottom
			l,					//   left
			l + w				//	 right
		]
	}

	Signature.prototype._addData = function(coordinate) {
		this.data.push(coordinate)
	}

	Signature.prototype._refreshCanvas = function(c, index) {
		var i = 0, j = 0
		this.snapLines.length = 0
		// todo : 计算方法调整
		for(; i < this.data.length; i++) {
			for(; j < this.data[i].length; j++) {
				if(i === index) {
					break
				}
				if(this.data[i][j] === c[j]) {
					var dir
					if(j === 0 || j === 4 || j === 5) {
						dir = 'x'
					} else {
						dir = 'y'
					}
					this.snapLines.push({
						dir: dir,
						position: c[j]
					})
					break
				}
			}
		}
		if(this.snapLines.length > 0) {
			this._generateSnapLines()
		}
	}

	Signature.prototype._generateSnapLines = function() {
		var i = 0, len = this.snapLines.length,
			$target = null, style = ''
		for(; i < len; i++) {
			if(this.snapLines[i].dir === 'x') {
				$target = this.$snapLineX
				style = {
					left: this.snapLines[i].position
				}
			} else {
				$target = this.$snapLineY
				style = {
					top: this.snapLines[i].position
				}
			}
			$target.show()
			$target.css(style)
		}
	}

	Signature.prototype._hideSnapLines = function() {
		this.$snapLineX.hide()
		this.$snapLineY.hide()
	}
	Signature.prototype._deleteEle = function($ele) {
		
		var index = parseInt($ele.data('index'), 10)
		this.data.splice(index, 1)

		$ele.off()
		$ele.remove()
	}

	Signature.prototype._showContextMenu = function(position) {
		this.$contextMenu.show()
						 .css({
						 	left: position.left,
						 	top: position.top
						 })
	}

	Signature.prototype._bindEvent = function($ele) {

		var self = this,
			current, coordinate, index

		// click
		$ele.on('click', function() {
			// 获取当前鼠标点击呼出的修改栏上下文
			self.$focusCtx = $ele
		})
		$ele.draggable({
			drag: function(w, h, l, t) {

					index = parseInt($ele.data('index'), 10)
					coordinate = self._getKeyPlace(w, h, l, t)

					self._hideSnapLines()
					self._refreshCanvas(coordinate, index)
			},
			stop: function() {
					self._hideSnapLines()
					// 更新数据
					self.data[index] = coordinate
			}
		})
				
	}

	window.Signature = Signature
})
