$(function() {

	'use strict'
	var TMPL_CONFIG = {

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
					 '</ul>',

		alterModalImage: '<div class="alter-modal alter-modal-image">' +
						 	'<div class="alter-group">' +
						 		'<label>项目:</label>' +
						 		'<span>微信二维码</span>' +
						 	'</div>' +
						 	'<div class="alter-preview">' +
						 		'<img src="" alt="">' +
						 	'</div>' +
						 	'<div class="alter-footer">' +
						 		'<button class="alter-button">上传图片</button>' +
						 	'</div>' +
						 '</div>',

		alterModalText: '<div class="alter-modal alter-modal-text">' +

						'</div>',
		propTextTmpl: 	'<div data-role="label" data-type="{{type}}" data-label="{{label}}">' +
							'<input type="text">' +
							'<span class="label-value">{{value}}</span>'+
						'</div>'
	}

	function Signature(opts) {
		this.$container = $(opts.container)
		this.$props = $(opts.props)
		this.data = []
		this.snapLines = []
		this.$focusCtx = null
		this.$snapLineX = $(TMPL_CONFIG.snapLineXTmpl)
		this.$snapLineY = $(TMPL_CONFIG.snapLineYTmpl)
		this.$contextMenu = $(TMPL_CONFIG.contextMenu)
		this.$contextMenuCtx = null
		this.propsInfo = {}
		this.init()
	}

	Signature.prototype.init = function() {
		var $labels = this.$container.find('[data-role="label"]'),
			width = this.$container.width(),
			height = this.$container.height()
		this.$consoleX = $('.toolbar-console .x')
		this.$consoleY = $('.toolbar-console .y')
		this.globalCenter = [width / 2, height / 2]
		this.$container.append(this.$snapLineX, this.$snapLineY, this.$contextMenu)
		if($labels.length > 0) {
			this.initStaffs($labels)
		}
		this.initContainerEvent()
		this.initPropsEvent()
	}

	Signature.prototype.initPropsEvent = function() {
		var self = this,
			$props = self.$props.find('.props-item')
		$props.on('dragstart', function(e) {
			var $this = $(this),
				label = $this.attr('data-label'),
				name = $this.attr('data-name'),
				type = $this.attr('data-type')

			self.propsInfo.label = label
			self.propsInfo.type = type
			self.propsInfo.name = name
		})
	}

	Signature.prototype.initContainerEvent = function() {
		var self = this
		self.$container.on({
			dragover: function(e) {
				e.preventDefault()
				self.$container.addClass('over')
			},
			dragleave: function(e) {
				self.$container.removeClass('over')
			},
			drop: function(e) {
				self.$container.removeClass('over')

				var name = self.propsInfo.name,
					label = self.propsInfo.label,
					type = self.propsInfo.type,
					html = TMPL_CONFIG.propTextTmpl.replace('{{label}}', label)
												   .replace('{{type}}', type)
												   .replace('{{prefix}}', config[label].prefix)
												   .replace('{{value}}', config[label].default),
					styles = {},
					$ele = $(html),
					width, height

				self.$container.append($ele)
				width = $ele.width(),
				height = $ele.height()
				styles = {
					left: e.offsetX - (width / 2),
					top: e.offsetY - (height / 2),
					fontFamily: config[label].fontFamily,
					fontSize: config[label].fontSize,
					color: config[label].color
				}

				$ele.css(styles)
				// todo: 以index为索引的数据存储有问题 
				self.initStaffs($ele)
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
				
			// 防止触发拖拽事件
			$(document).off('mousemove mouseup')
			self.$contextMenuCtx = $this
			position.left += e.offsetX
			position.top += e.offsetY

			self._showContextMenu(position)
		})
		
		self.$contextMenu.on('click', 'a', function() {
			var $target = $(this),
				action = $target.attr('data-action')
			if(action === 'alter') {
				
			} else if(action === 'delete') {
				self._deleteEle(self.$contextMenuCtx)
			}

		})
		self.$container.on('mousedown', '[data-role="label"]', function() {
			var $this = $(this),
				label = $this.attr('data-label'),
				type = $this.attr('data-type'),
				styles = $this.css([
							'fontFamily',
							'fontSize',
							'color',
							'left',
							'top'
						])
			self.contextMenuCtx
			self.$container.find('[data-role="label"]').removeClass('selected')
			$this.addClass('selected')
			self._adjustToolbar(type, styles)
		})
	}

	Signature.prototype._adjustToolbar = function(type, styles) {
		this._resetToolbar()

		var $imageLabel = $('.toolbar-image-upload > label'),
			$fontSizeInput = $('.toolbar-font-size > input'),
			$fontFamilySelect = $('.toolbar-font-family > select'),
			$fontColorInput = $('.toolbar-font-color > input')

		var position = this.$focusCtx.position()
		this.$consoleX.text(position.left)
		this.$consoleY.text(position.top)
		if(type === 'text') {
			$imageLabel.addClass('disabled')
			$fontSizeInput.val(parseInt(styles.fontSize, 10))
			$fontFamilySelect.val(styles.fontFamily)
			var color = styles.color
			if(isRgb(color)) {
				color = rgb2hex(color)
			}
			$fontColorInput.val(color)
		} else if(type === 'image') {
			$fontSizeInput.props('disabled', '')
			$fontFamilySelect.props('disabled', '')
			$fontColorInput.props('disabled', '')
		}
	}

	Signature.prototype._resetToolbar = function() {

		var $imageLabel = $('.toolbar-image-upload > label'),
			$fontSizeInput = $('.toolbar-font-size > input'),
			$fontFamilySelect = $('.toolbar-font-family > select'),
			$fontColorInput = $('.toolbar-font-color > input')

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

	Signature.prototype._compileTmpl = function(tmpl) {

	}

	Signature.prototype._refreshCanvas = function(c, index) {
		var i = 0, j = 0
		this.snapLines.length = 0
		// @todo : 计算方法调整
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
		$ele.on('mousedown', function() {
			// 获取当前鼠标点击呼出的修改栏上下文
			self.$focusCtx = $ele
		})
		$ele.draggable({
			drag: function(w, h, l, t) {

					index = parseInt($ele.data('index'), 10)
					coordinate = self._getKeyPlace(w, h, l, t)

					self._hideSnapLines()
					self._refreshCanvas(coordinate, index)
					self.$consoleX.text(l)
					self.$consoleY.text(t)
			},
			stop: function() {
					self._hideSnapLines()
					// 更新数据
					self.data[index] = coordinate
			}
		})

		$ele.dblclick(function() {
			var $this = $(this),
				$innerInput = $this.find('input'),
				$innerSpan = $this.find('.label-value')
			$innerSpan.hide()
			$innerInput.show().val($innerSpan.text())

			$innerInput.on('blur', function() {
				var value = $innerInput.val()
				if(!value) {
					self._deleteEle($ele)
				} else {
					$innerInput.hide()
					$innerSpan.show()
					$innerSpan.text(value)
				}
			})

		})
				
	}

	window.Signature = Signature

	// http://jsfiddle.net/Mottie/xcqpF/1/light/
	function rgb2hex(rgb){
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 	return (rgb && rgb.length === 4) ? "#" +
	  		("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  		("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	function isRgb(str) {
		return (str.match(/^rgba?/)).length > 0
	}
})
