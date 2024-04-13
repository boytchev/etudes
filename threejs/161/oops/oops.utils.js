/*
	OOPS Effects Utils
	
	isShader( something )
	isPass( something )
	isString( something )
	bakeUniform( pass, shaderName, uniformName, uniformValue )
	renameWord( pass, shaderName, word, newWord )
	renameText( pass, shaderName, text, newText )
	getGlobalNames( pass, shaderName )
	defaultTextureName( pass )
	defaultUVCoordName( pass )
	hasSimpleShader( pass )
	mergeSimplePasses( thisPass, thatPass, options )

*/

import { Vector2, Vector3, Color } from 'three';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { KB } from './oops.kb.js';


// convert a number to string with decimal point

function toFloat( x )
{
	if( Number.isInteger(x) )
		return x.toFixed( 1 );
	else
		return x+'';
} // toFloat



// returns whether something is a string

function isString( something )
{
	return ( something instanceof String ) || (typeof something === 'string' );
	
}


// return true is something looks like a Three.js shader

function isShader( something )
{
	
	if( !something ) return false;
	if( !something.vertexShader ) return false;
	if( !something.fragmentShader ) return false;
	if( !something.uniforms ) return false;
	
	return true;
	
} // isShader



// return true is something is THREE.Pass

function isPassClass( something )
{

	return( something.prototype instanceof Pass );
	
} // isPassClass



// return true is something is an instance of THREE.Pass

function isPass( something )
{
	return( something instanceof Pass );
	
} // isPass



// bakes uniform value into a shader of a THREE.ShaderPass
// by replacing "uniform..." with "#define..."
//
// returns true if baking is successful

function bakeUniform( pass, shaderName, uniformName, uniformValue )
{
	var glsl = pass.material[shaderName];

	// if from exists in glsl, replace it with to and
	// remove the corresponding uniform declaration
	function replaced( from, to )
	{
		// replace spaces by "any-white-space-characters"
		from = '(?<=^[\\s]*)' + from.replaceAll( ' ', '[\\s]+' );
		
		var regex = new RegExp( from, 'gm' );
		
		if( regex.test(glsl) )
		{
			pass.material[shaderName] = glsl.replace( regex, to );
			delete pass.uniforms[uniformName];
			return true;
		}
		return false;
	}
	
	if( uniformValue instanceof Color )
	{
		if( replaced(
			`uniform vec3 ${uniformName};`,
			`#define ${uniformName} vec3(${uniformValue.r},${uniformValue.g},${uniformValue.b})`
		)) return true;
	}
		
	if( uniformValue instanceof Vector3 )
		if( replaced(
			`uniform vec3 ${uniformName};`,
			`#define ${uniformName} vec3(${uniformValue.x},${uniformValue.y},${uniformValue.z})`
		)) return true;
		
	if( uniformValue instanceof Vector2 )
		if( replaced(
			`uniform vec2 ${uniformName};`,
			`#define ${uniformName} vec2(${uniformValue.x},${uniformValue.y})`
		)) return true;

	if( uniformValue==true || uniformValue==false )
		if( replaced(
			`uniform bool ${uniformName};`,
			`#define ${uniformName} ${uniformValue}`
		)) return true;
		
	if( replaced(
		`uniform float ${uniformName};`,
		`#define ${uniformName} ${toFloat(uniformValue)}`
	)) return true;
		
	if( replaced(
		`uniform int ${uniformName};`,
		`#define ${uniformName} ${Math.round(uniformValue)}`
	)) return true;
	
	return false;
	
} // bakeUniform



// renames a word in shader source

function renameWord( pass, shaderName, word, newWord )
{
	var glsl = pass.material[shaderName];

	var regex = new RegExp( `\\b${word}\\b`, 'g' );
		
	pass.material[shaderName] = glsl.replace( regex, newWord );
	
} // renameWord



// renames a text in shader source (verbatim)

function renameText( pass, shaderName, text, newText )
{
	var glsl = pass.material[shaderName];

	pass.material[shaderName] = glsl.replaceAll( text, newText );
	
} // renameText



// shows information about shaders

function showShaders( effects )
{
	console.group( 'Effects' );
	
	for( var pass of effects.passes )
	{
		if( pass.name )
			console.groupCollapsed( 'Pass '+pass.constructor.name+' ('+pass.name+')' );
		else
			console.groupCollapsed( 'Pass '+pass.constructor.name );
		
		if( pass.material?.vertexShader )
		{
			console.groupCollapsed( 'Vertex shader' );
			console.log( pass.material.vertexShader );
			console.groupEnd( ); // Vertex shader
		}

		if( pass.material?.fragmentShader )
		{
			console.groupCollapsed( 'Fragment shader' );
			console.log( pass.material.fragmentShader );
			console.groupEnd( ); // Fragment shader
		}

		if( pass.uniforms )
		{
			console.groupCollapsed( 'Uniforms' );
			for( var [key, value] of Object.entries(pass.uniforms) )
				console.log( `${key}:`, value );
			console.groupEnd( ); // Uniforms
		}

		if( pass.material?.defines )
		{
			console.groupCollapsed( 'Defines' );
			for( var [key, value] of Object.entries(pass.material.defines) )
				console.log( `${key}:`, value );
			console.groupEnd( ); // Defines
		}
		
		console.groupEnd( ); // Pass
		
	} // for pass
	
	if( effects.onSizeUniforms.length>0 )
	{
		console.groupCollapsed( 'Size Uniforms' );
		for( var key of effects.onSizeUniforms )
			console.log( key );
		console.groupEnd( ); // Size Uniforms
	}
		
	console.groupEnd( ); // Effects
	
} // showShaders



// get the default name of input texture
function defaultTextureName( pass )
{
	if( isString(KB[pass.name]?.defaultTextureName) )
		return KB[pass.name].defaultTextureName;
				
	return 'tDiffuse';
	
} // defaultTextureName



// get the default name of UV coordinates
function defaultUVCoordName( pass )
{
	if( isString(KB[pass.name]?.defaultUVCoordName) )
		return KB[pass.name].defaultUVCoordName;
				
	return 'vUv';
	
} // defaultUVCoordName



// get whether a pass has a simple shader
function hasSimpleShader( pass )
{
	if( !pass.material ) return false; // all simple shaders have materials in their passes
	
	if( !KB[pass.material.name] ) return true; // all simple shaders have materials with names
		
	if( typeof KB[pass.material.name]?.simpleShader === 'undefined' ) return true;
	
	return KB[pass.material.name].simpleShader;
	
} // hasSimpleShader
	


// strip parentheses pair
function stripParentheses( string, openParen, closeParen )
{
	var	result = '',
		nesting = 0;
		
	for( var ch of string )
	{
		if( ch==openParen )  result += ch, nesting++;
		if( nesting==0 )     result += ch;
		if( ch==closeParen ) result += ch, nesting--;
	}
	
	return result;
}



// get a list of all global constants, variables and
// functions in shader code

function getGlobalNames( pass, shaderName, excludeDefaults=false )
{
	if( !pass.material ) return [];
	if( !pass.id ) return [];
	
	var glsl = pass.material[shaderName],
		result = [];
	
	// remove all {...} sections, this eliminates all local definitions
	// then remove all (...) sections, to eliminate all functions parameters
	var stripped = stripParentheses( glsl, '{', '}' );
		stripped = stripParentheses( stripped, '(', ')' );
		
	// get all words after type names
	const TYPES = ['void','int','float','vec2','vec3','vec4','mat2','mat3','mat4','sampler2D','bool'];
	
	for( var type of TYPES )
	{
		var regex = new RegExp( `(?<=${type}[\\s]+)[\\w]+`, 'g' );
		var matches = stripped.matchAll( regex );
		result.push( ...[...matches].map( x => x[0] ) );
	}

	// remove some word from the list:
	//	  - the 'main' name
	//	  - the name for the input texture
	//	  - the name for the UV coordinates in the fragment shader
	//	  - all the names of uniforms
	if( excludeDefaults )
	{
		var words = [
				'main',
				defaultTextureName( pass ),
				defaultUVCoordName( pass ),
				...Object.keys(pass.uniforms),
			]
			
		result = result.filter( x => words.indexOf(x)<0 );
	}

	return result;
	
} // getGlobalNames



// merges two simple passes:  this<-this+that
// returns trus if merging done

function mergeSimplePasses( thisPass, thatPass, options )
{
	// process vertex shader
	{
		var thisVS = thisPass.material.vertexShader,
			thatVS = thatPass.material.vertexShader;
		
		// if both shaders use differenr names for "vUv", use the "vUv" of "thisPass"
		// replace "vUv" with the other "vUv"
		if( defaultUVCoordName(thisPass) != defaultUVCoordName(thatPass) )
		{
			regex = new RegExp( `\\b${defaultUVCoordName(thatPass)}\\b`, 'g' );
			console.log( `\\b${defaultUVCoordName(thatPass)}\\b`,'->',defaultUVCoordName(thisPass));
			thatVS = thatVS.replaceAll( regex, defaultUVCoordName(thisPass) );
		}
		
console.log('--------------')
console.log(thisVS.split('\n').filter(x=>x).map(x=>x.replace( /\s/g, '' )))
console.log('--------------')
console.log(thatVS.split('\n').filter(x=>x).map(x=>x.replace( /\s/g, '' )))		
console.log('--------------')
		var thisSpacelessVS = thisVS.replace( /\s/g, '' ),
			thatSpacelessVS = thatVS.replace( /\s/g, '' );
		if( thisVS.indexOf( thatVS ) >= 0 )
		{
			console.log(2)
			// thatVS is included in thisVS -- do nothing
		}
		else
		if( thatVS.indexOf( thisVS ) >= 0 )
		{
			// thisVS is included in thatVS -- use thatVS
			thisPass.material.vertexShader = thatPass.material.vertexShader;
		}
		else
		{
			// warn that there is mismatch between shaders, maybe not simple shaders?
			if( options.WARNINGS || options.VERBOSE ) console.warn( `\twarning Two passes (${thisPass.id} and ${thatPass.id}) are declared as simple in the OOPS KB, but their vertex shaders are not compatible -- only the first vertex shader is used` );
		}
	} // vertex shaders

	// process fragment shaders
	{
		var thisFS = thisPass.material.fragmentShader,
			thatFS = thatPass.material.fragmentShader;

		var regex;

		// rename "void main()" -> "vec4 main_2(sampler2D tDiffuse, vec2 vUv)"
		// rename "void main(void)" -> "vec4 main_2(sampler2D tDiffuse, vec2 vUv)"
		regex = new RegExp( `void[\\s]+main[\\s]*\\([\\s]*(void)?[\\s]*\\)`, 'g' );
		thisFS = thisFS.replace( regex, `vec4 main_${thisPass.id}( sampler2D ${defaultTextureName(thatPass)}, vec2 ${defaultUVCoordName(thatPass)})` );

		// rename "gl_FragColor = " -> "return"
		regex = new RegExp( `gl_FragColor[\\s]*=`, 'g' );
		thisFS = thisFS.replaceAll( regex, `return ` );

		// remove "uniform sampler2D tDiffuse;"
		regex = new RegExp( `uniform[\\s]+sampler2D[\\s]+${defaultTextureName(thatPass)}[\\s]*;`, 'g' );
		thatFS = thatFS.replace( regex, '' );

		// remove "varying vec2 vUv;"
		regex = new RegExp( `varying[\\s]+vec2[\\s]+${defaultUVCoordName(thatPass)}[\\s]*;`, 'g' );
		thatFS = thatFS.replace( regex, '' );

		// if both shaders use differenr names for "vUv", use the "vUv" of "thisPass"
		// replace "vUv" with the other "vUv"
		if( defaultUVCoordName(thisPass) != defaultUVCoordName(thatPass) )
		{
			regex = new RegExp( `\\b${defaultUVCoordName(thatPass)}\\b`, 'g' );
			console.log( `\\b${defaultUVCoordName(thatPass)}\\b`,'->',defaultUVCoordName(thisPass));
			thatFS = thatFS.replaceAll( regex, defaultUVCoordName(thisPass) );
		}
		
		// rename "texture2D( tDiffuse," -> "main_2( tDiffuse"
		regex = new RegExp( `texture2D[\\s]*\\([\\s]*${defaultTextureName(thatPass)}`, 'g' );
		thatFS = thatFS.replaceAll( regex, `main_${thisPass.id}( ${defaultTextureName(thatPass)}` );
				
		thisPass.material.fragmentShader = thisFS + '\n\n' + thatFS;
	} // fragment shaders

	
	// process uniforms
	{
		var thisUN = thisPass.uniforms,
			thatUN = thatPass.uniforms;

		// merge uniforms, if collission, thisUN overwrites thatUN
		thisPass.uniforms = {...thatUN,...thisUN};
		thisPass.material.uniforms = thisPass.uniforms;
	} // fragment shaders

	
	// process defines
	{
		var thisDEF = thisPass.material.defines,
			thatDEF = thatPass.material.defines;

		// merge defines, if collission, thisDEF overwrites thatDEF
		thisPass.material.defines = {...thatDEF,...thisDEF};
		thisPass.material.needsUpdate = true;
	} // defines
	
	
	// process shader names
	{
		thisPass.name += '+'+thatPass.name;
	} // fragment shaders
	
	return true;
	
} // mergeSimplePasses



export { isShader, isPass, isPassClass, isString, bakeUniform, renameWord, renameText, getGlobalNames, showShaders, hasSimpleShader, mergeSimplePasses, defaultTextureName };
