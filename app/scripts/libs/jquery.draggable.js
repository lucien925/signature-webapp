$(function() {

	// by lucienyu
	// 史上最简单的jQuery拖拽插件

	$.fn.extend({
		draggable: function(opts) {
			var $this = $(this),
				params = {
					left: 0,
					top: 0,
					width: 0,
					height: 0
				},
				opts = opts || {},
				position = $this.position(),
				width = $this.width(),
				height = $this.height(),
				$document = $(document)
			params.left = position.left
			params.top = position.top
			params.width = width
			params.height = height
			
			$this.on('mousedown', function(e) {
				var startX = e.clientX,
					startY = e.clientY,
					position = $this.position()
					
				params.left = position.left
				params.top = position.top
				$(window).on('selectstart', function() {
					return false
				})
				var $target = $(e.target)
				if($target.attr('data-action') === 'resize') {
					$document.on('mousemove', function(e) {
						e.preventDefault()
						e.stopPropagation()

						var nowX = e.clientX,
							nowY = e.clientY,
							disX = nowX - startX,
							disY = nowY - startY
						if(width > 10 /* min-width */) {
							$this.css({
								width: params.width + disX
							})
						}	
						if(height > 10 /* min-height */) {
							$this.css({
								height: params.height +disY
							})
						}
						if(opts.resize) {
							opts.resize.call($this)
						}
					})
				} else {
					$document.on('mousemove', function(e) {
						e.preventDefault()
						e.stopPropagation()

						var nowX = e.clientX,
							nowY = e.clientY,
							disX = nowX - startX,
							disY = nowY - startY
						var left = params.left + disX,
							top = params.top + disY

						if(opts.drag) {
							var result = opts.drag(width, height, left, top)
						}
						$this.css({
							left: left,
							top: top
						})
					})
				} 

				$document.on('mouseup', function(e) {
					e.preventDefault()
					e.stopPropagation()
					$document.off('mousemove mouseup')
					if(opts.stop) {
						opts.stop($this)
					}
					var _position = $this.position()

					params.left = _position.left
					params.top = _position.top
					params.width = $this.width()
					params.height = $this.height()
				})
			})		
		}
	})
})