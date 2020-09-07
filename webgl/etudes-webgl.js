
// A helper library to maintain shader compilation into a program 
// and automatic extraction of uniform and attribute variables


var gl; // global WebGL context
var glprog; // global GLSL program


var FLOATS = Float32Array.BYTES_PER_ELEMENT;


function getContext( id )
{
    var canvas = document.getElementById( id );
    if (!canvas)
	{
        alert( "Missing canvas with id=\"" + id + "\"" );
        return null;
    }

    var context = canvas.getContext( "webgl" );
    if (!context) {
        alert( "Missing WebGL context" );
    }

    return context;
}


function getShader( id, type )
{
    var source = document.getElementById( id ).text,
		shader = gl.createShader( type );

    gl.shaderSource( shader, source );
	
    gl.compileShader( shader );
    if (!gl.getShaderParameter( shader, gl.COMPILE_STATUS ))
	{
        alert( gl.getShaderInfoLog(shader) );
        return null;
    }

    return shader;
}


function getProgram( idv, idf )
{
    var vShader = getShader( idv, gl.VERTEX_SHADER ),
		fShader = getShader( idf, gl.FRAGMENT_SHADER );

    if (!vShader || !fShader)
        return null;

    var shaderProgram = gl.createProgram();
		gl.attachShader( shaderProgram, vShader );
		gl.attachShader( shaderProgram, fShader );
		gl.linkProgram( shaderProgram );

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{
        alert( gl.getProgramInfoLog(shaderProgram) );
        return null;
    }

    gl.useProgram( shaderProgram );
	
	getVariables( shaderProgram );
	
    return shaderProgram;
}


function getVariables( glprog )
{
	// Extract uniform and attribute variables from a GLSL program
	// and decrate global JavaScript variables with the same names
	
    for (var i = 0; i < gl.getProgramParameter(glprog, gl.ACTIVE_UNIFORMS); i++)
	{
        var name = gl.getActiveUniform( glprog, i ).name;
        window[name] = gl.getUniformLocation( glprog, name );
    }

    for (var i = 0; i < gl.getProgramParameter(glprog, gl.ACTIVE_ATTRIBUTES); i++)
	{
        var name = gl.getActiveAttrib( glprog, i ).name;
        window[name] = gl.getAttribLocation( glprog, name );
    }
}