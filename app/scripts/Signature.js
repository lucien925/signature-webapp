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
						'</div>',
		propImageTmpl: '<div data-role="label" data-type="{{type}}" data-label="{{label}}">' +
					   	   '<img src="../images/lucienyu.png" width="80" height="80">' + 
					   '</div>'
	}

	function Signature(opts) {
		this.$container = $(opts.container)
		this.$props = $(opts.props)
		this.data = {}
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
		this.initToolbarEvent()
	}

	Signature.prototype.initToolbarEvent = function() {
		var self = this
		self.$imageUploadInput = $('.toolbar-image-upload > input'),
		self.$fontSizeInput = $('.toolbar-font-size > input'),
		self.$fontFamilySelect = $('.toolbar-font-family > select'),
		self.$fontColorInput = $('.toolbar-font-color > input')

		self.$imageUploadInput.on('change', function(e) {
			var file = e.target.files[0],
				reader = new FileReader(),
				URL = window.URL || window.webkitURL,
				blobUrl

			reader.onload = function(e) {
				var result = e.target.result
				self.$focusCtx.find('img').attr('src', result)
			}
			reader.readAsDataURL(file)
		})	

		// input type=number 
		self.$fontSizeInput.on('input', function() {
			var $this = $(this),
				value = $this.val()
			self.$focusCtx.css({
				fontSize: value + 'px'
			})
		})

		self.$fontFamilySelect.on('change', function() {
			var $this = $(this),
				value = $this.val()

			self.$focusCtx.css({
				fontFamily: value
			})
		})

		self.$fontColorInput.on('change', function() {
			var $this = $(this),
				value = $this.val()
			self.$focusCtx.css({
				color: value
			})
		})
	}

	Signature.prototype.initPropsEvent = function() {
		var self = this,
			$props = self.$props.find('.props-item')
		$props.on('dragstart', function(e) {
			var $this = $(this),
				label = $this.attr('data-label'),
				type = $this.attr('data-type')

			self.propsInfo.label = label
			self.propsInfo.type = type
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

				var label = self.propsInfo.label,
					type = self.propsInfo.type

				var html = ''
				if(type === 'text') {
					html = TMPL_CONFIG.propTextTmpl.replace('{{label}}', label)
												   .replace('{{type}}', type)
												   .replace('{{prefix}}', config[label].prefix)
												   .replace('{{value}}', config[label].default)
				} else if(type === 'image') {
					html = TMPL_CONFIG.propImageTmpl.replace('{{label}}', label)
												    .replace('{{type}}', type)
				}
				var styles = {},
					$ele = $(html),
					width, height

				self.$container.append($ele)
				width = $ele.width(),
				height = $ele.height()
				if(type === 'text') {
					styles = {
						left: e.offsetX - (width / 2),
						top: e.offsetY - (height / 2),
						fontFamily: config[label].fontFamily,
						fontSize: config[label].fontSize + 'px',
						color: config[label].color
					}
				} else if(type === 'image') {
					styles = {
						left: e.offsetX - (width / 2),
						top: e.offsetY - (height / 2)
					}
				}

				$ele.css(styles)
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
			if(helper.isRgb(color)) {
				color = helper.rgb2hex(color)
			}
			$fontColorInput.val(color)
		} else if(type === 'image') {
			$fontSizeInput.prop('disabled', true)
			$fontFamilySelect.prop('disabled', true)
			$fontColorInput.prop('disabled', true)
		}
	}

	Signature.prototype._resetToolbar = function() {

		var $imageLabel = $('.toolbar-image-upload > label'),
			$fontSizeInput = $('.toolbar-font-size > input'),
			$fontFamilySelect = $('.toolbar-font-family > select'),
			$fontColorInput = $('.toolbar-font-color > input')
		$imageLabel.removeClass('disabled')
		$fontSizeInput.prop('disabled', false)
		$fontFamilySelect.prop('disabled', false)
		$fontColorInput.prop('disabled', false)

	}

	Signature.prototype.initStaffs = function($ele) {
		var self = this
		$ele.each(function() {
			var $this = $(this),
				position = $this.position(),
				width = $this.width(),
				height = $this.height(),
				key = helper.generateUUID(),  // key <= uuid
				coordinate
			$this.data('key', key)
			coordinate = self._getKeyPlace(width, height, position.left, position.top)
			self._addData(key, coordinate)
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

	Signature.prototype._addData = function(key, coordinate) {
		this.data[key] = coordinate
	}


	Signature.prototype._refreshCanvas = function(key, coordinate) {
		var i = 0, j = 0,
			k, len, data
		// 先把辅助线全部删除
		this.snapLines.length = 0
		
		// for(; i < this.data.length; i++) {
		// 	for(; j < this.data[i].length; j++) {
		// 		if(i === index) {
		// 			break
		// 		}
		// 		if(this.data[i][j] === c[j]) {
		// 			var dir
		// 			if(j === 0 || j === 4 || j === 5) {
		// 				dir = 'x'
		// 			} else {
		// 				dir = 'y'
		// 			}
		// 			this.snapLines.push({
		// 				dir: dir,
		// 				position: c[j]
		// 			})
		// 			break
		// 		}
		// 	}
		// }
		// for(k in this.data) {
		// 	if(k === key) {
		// 		continue
		// 	}
		// 	data = this.data[k] 
		// 	len = data.length   // len也等于coordinate的长度
		// 	for(; i < len; i++) {
		// 		for()
		// 	}
		// }
		len = coordinate.length
		
		for(; i < len; i++) {
			// 检测是否与与绘制面板中心区域对齐
			if(coordinate[0] === this.globalCenter[0] || coordinate[1] === this.globalCenter[1]) {
				if(coordinate[0] === this.globalCenter[0]) {
					this.snapLines.push({
						dir: 'x',
						position: coordinate[0]
					})
				} else if(coordinate[1] === this.globalCenter[1]) {
					this.snapLines.push({
						dir: 'y',
						position: coordinate[1]
					})
				}
				break
			}
			for(k in this.data) {
				if(k === key) {
					continue
				}
				data = this.data[k]

				//比较当前移动的物体的x轴中心点、x轴左变、x轴右边是否和面板中的其他元素有重叠
				if(coordinate[0] === data[0]) {
					this.snapLines.push({
						dir: 'x',
						position: coordinate[0]
					})
				} else if(coordinate[4] === data[4] || coordinate[4] === data[5]) {
					this.snapLines.push({
						dir: 'x',
						position: coordinate[4]
					})
				} else if(coordinate[5] === data[4] || coordinate[5] === data[5]) {
					this.snapLines.push({
						dir: 'x',
						position: coordinate[5]
					})
				}
				//比较当前移动的物体的y轴中心点、y轴左变、y轴右边是否和面板中的欠他元素有重叠
				if(coordinate[1] === data[1]) {
					this.snapLines.push({
						dir: 'y',
						position: coordinate[1]
					})	
				} else if(coordinate[2] === data[2] || coordinate[2] === data[3]) {
					this.snapLines.push({
						dir: 'y',
						position: coordinate[2]
					})
				} else if(coordinate[3] === data[2] || coordinate[3] === data[3]) {
					this.snapLines.push({
						dir: 'y',
						position: coordinate[3]
					})
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
		// 删除当前元素存储的坐标信息
		var key = $ele.data('key')
		delete this.data[key]
        
        // 移除所有对该元素绑定的事件
		$ele.off()
		// 在DOM中删除该元素
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
			current, coordinate, key

		// click
		$ele.on('mousedown', function() {
			// 修改当前绘制面板焦点元素上下文
			self.$focusCtx = $ele
		})
		$ele.draggable({
			drag: function(w, h, l, t) {

					key = $ele.data('key')
					coordinate = self._getKeyPlace(w, h, l, t)

					self._hideSnapLines()
					self.$consoleX.text(l)
					self.$consoleY.text(t)
					self._refreshCanvas(key, coordinate)
					
					
			},
			stop: function() {
					self._hideSnapLines()
					// 更新数据
					self.data[key] = coordinate
			}
		})

		$ele.dblclick(function() {
			var $this = $(this),
				$innerInput = $this.find('input'),
				$innerSpan = $this.find('.label-value')
			$innerSpan.hide()
			$innerInput.show().focus().val($innerSpan.text())

			$innerInput.on('blur', function() {
				var value = $innerInput.val()
				if(!value) {
					self._deleteEle($ele)
				} else {
					$innerInput.hide()
					$innerSpan.show().text(value)
					// 在更新完画布内容的时候，重新计算当前元素的
					var width = $ele.width(),
						height = $ele.height(),
						position = $ele.position(),
						coordinate = self._getKeyPlace(width, height, position.left, position.top),
						key = $ele.data('key')
					self.data[key] = coordinate
				}
			})

		})
				
	}

	window.Signature = Signature

})
