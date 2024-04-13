/*
	OOPS Effects KnowledgeBase
	
	KB = {
		shadername: {
			ignoreUniformBaking: [string,string,...],	// do not bake uniforms with these names
			defaultTextureName: string,					// default texture uniform name (or 'tDiffuse' if not defined)
			defaultUVCoordName: string,					// default UV coordinates name (or 'vUv' if not defined)
			simpleShader: boolean,						// if true, shader uses tDiffuse, vUv and has no passes
			cannotSelfMerge: boolean,					// if true, shader cannot merge with itself in a single shader
			onLoad: function(pass,effect), // called after loading a fragment shader
			onSize: {X,Y,XY,InvX,InvY,InvXY:string,...}	// names of uniforms bound to frame/screen size in pixels
			onTime: string,								// name of uniform bound to time in milliseconds
		}
	}
*/


import { renameWord, renameText } from './oops.utils.js';



const KB = {

	/*------------------------------------------------------
		The definition of "toneMappingExposure" is not in the shade code, but
		in an include file, so it is not possible to bake it
	*/
	OutputShader: {
		simpleShader: false,
		ignoreUniformBaking: ['toneMappingExposure'],
	},

	
	/*------------------------------------------------------
		The fragment shader contains "vec3 sample", which causes error:
			ERROR: 'sample' : Illegal use of reserved word
		It also contains "vec2 texel = vec2(...", which causes error:
			ERROR: '=' : global variable initializers must be constant expressions
	*/
	FreiChenShader: {
		onSize: {XY: 'aspect'},
		onLoad: onLoadFreiChenShader,
	},

	
	DotScreenShader: {
		onSize: {XY: 'tSize'},
		onLoad: onLoadDotScreenShader,
	},

	
	DotScreenShaderX: {
		onSize: {XY: 'tSize'},
		onLoad: onLoadDotScreenShader,
	},

	
	FilmShader: {
		onTime: 'time',
		onLoad: onLoadFilmShader,
	},

	
	FilmPass: {
		onTime: 'time',
//		onLoad: onLoadFilmShader,
	},

	
	FilmShaderX: {
		onTime: 'time',
		onLoad: onLoadFilmShader,
	},

	
	LuminosityShader: {
		onLoad: onLoadLuminosityShader,
	},

	
	FocusShader: {
		onSize: {X: 'screenWidth', Y: 'screenHeight'},
	},

	
	FXAAShader: {
		onSize: {InvXY: 'resolution'},
		onLoad: onLoadFXAAShader,
		cannotSelfMerge: true,
	},


	SobelOperatorShader: {
		onSize: {XY: 'resolution'},
	},


	KaleidoShaderX: {
		onSize: {XY: 'resolution'},
	},


	HalftoneShader: {
		onSize: {X: 'width', Y: 'height'},
		cannotSelfMerge: true,
		defaultUVCoordName: 'vUV',
	},


	HorizontalBlurShader: {
		onSize: {InvX: 'h'},
	},


	HorizontalBlurShaderX: {
		onSize: {InvX: 'h'},
	},


	HorizontalTiltShiftShader: {
		onSize: {InvX: 'h'},
	},


	HorizontalTiltShiftShaderX: {
		onSize: {InvX: 'h'},
	},


	/*------------------------------------------------------
		The fragment shader of TriangleBlurShader contains:
			uniform sampler2D texture;
		which later on causes:
			ERROR: 0:160: 'texture' : function name expected
	*/
	TriangleBlurShader: {
		defaultTextureName: 'uTexture',
		cannotSelfMerge: true,
		onLoad: onLoadTriangleBlurShader,
	},
	
	
	VerticalBlurShader: {
		onSize: {InvY: 'v'},
	},


	VerticalBlurShaderX: {
		onSize: {InvY: 'v'},
	},


	VerticalTiltShiftShader: {
		onSize: {InvY: 'v'},
	},
	
	
	VerticalTiltShiftShaderX: {
		onSize: {InvY: 'v'},
	},
	
	
	UnpackDepthRGBAShader: {
		onLoad: onLoadUnpackDepthRGBAShader,
	},
	
	
	ConvolutionShader: {
		onLoad: onLoadConvolutionShader,
	}
	
}


function onLoadFreiChenShader( pass, effect )
{
	renameWord( pass, 'fragmentShader', 'sample', 'sampleRGB' );
	renameText( pass, 'fragmentShader', 'float pattern()', 'float pattern(vec2 vUv)'  );
	
	var texel = 'vec2 texel = vec2( 1.0 / aspect.x, 1.0 / aspect.y );';
	renameText( pass, 'fragmentShader', texel, '' );
	renameText( pass, 'fragmentShader', 'vec3 sampleRGB;', 'vec3 sampleRGB;\n\t\t'+texel );
	
}


function onLoadDotScreenShader( pass, effect )
{
	renameText( pass, 'fragmentShader', 'float pattern()', 'float pattern(vec2 vUv)'  );
	renameText( pass, 'fragmentShader', '+ pattern()', '+ pattern(vUv)'  );
}


function onLoadFilmShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#include <common>', `
		#ifndef OOPS_INCLUDE_COMMON
			#define OOPS_INCLUDE_COMMON
			#include <common>
		#endif
` );
}


function onLoadLuminosityShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#include <common>', `
		#ifndef OOPS_INCLUDE_COMMON
			#define OOPS_INCLUDE_COMMON
			#include <common>
		#endif
` );
}


function onLoadFXAAShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#define NUM_SAMPLES 5', `
		#ifndef OOPS_FXAA_NUM_SAMPLES
			#define OOPS_FXAA_NUM_SAMPLES
			#define NUM_SAMPLES 5
		#endif
` );
	renameWord( pass, 'fragmentShader', 'NUM_SAMPLES', 'FXAA_NUM_SAMPLES' );

	renameText( pass, 'fragmentShader',
		'#define FxaaTexTop(t, p) texture2D(t, p, -100.0)',
		'#define FxaaTexTop(tDiffuse, vUv) texture2D(tDiffuse, vUv)'
	);
	
	renameText( pass, 'fragmentShader',
		'#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)',
		'#define FxaaTexOff(tDiffuse, vUv, o, r) texture2D(tDiffuse, vUv + (o * r))'
	);
}


function onLoadUnpackDepthRGBAShader( pass, effect )
{
	renameText( pass, 'fragmentShader', '#include <packing>', `
		#ifndef OOPS_INCLUDE_PACKING
			#define OOPS_INCLUDE_PACKING
			#include <packing>
		#endif
` );
}


function onLoadTriangleBlurShader( pass, effect )
{
	// rename uniform 'texture' -> 'uTexture'
	pass.uniforms['uTexture'] = {value: null};
	pass.material.uniforms['uTexture'] = {value: null};
	
	delete pass.uniforms['texture']
	delete pass.material.uniforms['texture']
	
	renameWord( pass, 'fragmentShader', 'texture', 'uTexture' );
	renameText( pass, 'fragmentShader', '#include <common>', `
		#ifndef OOPS_INCLUDE_COMMON
			#define OOPS_INCLUDE_COMMON
			#include <common>
		#endif
` );
}


function onLoadConvolutionShader( pass, effect )
{
	pass.material.uniforms.cKernel.value = effect.buildKernel( 4 );
}


export { KB };
