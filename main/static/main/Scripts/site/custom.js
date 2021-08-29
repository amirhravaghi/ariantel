$('document').ready(()=>{
	$('.navItem').hover(function(){
		$(this).addClass('active-navItem');
	},function(){
		$(this).removeClass('active-navItem');
	})

});
