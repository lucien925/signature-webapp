$(function() {
	// 史上最简单的jQuery拖拽插件
	// by lucienyu
	$.fn.extend({
		draggable: function(opts) {
			var $this = $(this),
				params = {
					left: 0,
					top: 0
				},
				opts = opts || {},
				position = $this.position()
			params.left = position.left
			params.top = position.top
			
			$this.on('mousedown', function(e) {
				e.preventDefault()
				var startX = e.clientX,
					startY = e.clientY
				$(window).on('selectstart', function() {
					return false
				})
				$this.on('mousemove', function(e) {
					e.preventDefault()

					var nowX = e.clientX,
						nowY = e.clientY,
						disX = nowX - startX,
						disY = nowY - startY
					var left = params.left + disX,
						top = params.top + disY

					if(opts.drag) {
						var result = opts.drag(left, top)
						if(result === false) {
							return
						}
					}
					$this.css({
						left: left,
						top: top
					})
				})

				$this.on('mouseup', function(e) {
					e.preventDefault()
					$this.off('mousemove')
					$this.off('mouseup')
					if(opts.stop) {
						opts.stop()
					}
					var _position = $this.position()
					if(Math.abs(_position.left - params.left) < 5 
						&& Math.abs(_position.top - params.top) < 5) {
						$this.trigger('specialClick')
					}
					params.left = _position.left,
					params.top = _position.top
				})
			})

			
		}
	})
})