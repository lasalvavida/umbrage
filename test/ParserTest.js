import Parser from '../lib/Parser'
import Variable from '../lib/Variable'
import {expect} from 'Chai'

describe('Parser', function() {
  describe('preprocess', function() {
    it('strips out macro lines', function() {
      var input = '#some\n' +
        'hello\n' +
        '#macro\n' +
        'world\n' +
        '#removal\n'
      var output = Parser.preprocess(input)
      expect(output).to.equal('hello\nworld')
    })

    it('substitutes defined macros', function() {
      var input = '#define MACRO 1\n' +
        '#define ANOTHER_MACRO 2\n' +
        'int i = MACRO;\n' +
        'int j = ANOTHER_MACRO;\n'
      var output = Parser.preprocess(input)
      expect(output).to.equal('int i = 1;\nint j = 2;')
    })
  })

  describe('parseInstruction', function() {
    it('parses bool declaration', function() {
      var input = 'bool x'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.BOOL)
      expect(output.name).to.equal('x')
    })

    it('parses int declaration', function() {
      var input = 'int y'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.INT)
      expect(output.name).to.equal('y')
    })

    it('parses uint declaration', function() {
      var input = 'uint z'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.UINT)
      expect(output.name).to.equal('z')
    })

    it('parses float declaration', function() {
      var input = 'float v'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.FLOAT)
      expect(output.name).to.equal('v')
    })

    it('parses double declaration', function() {
      var input = 'double w'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.DOUBLE)
      expect(output.name).to.equal('w')
    })

    it('parses vec3 declaration', function() {
      var input = 'vec3 v'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.VECTOR)
      expect(output.name).to.equal('v')
      expect(output.members.length).to.equal(3)
      for (var i = 0; i < output.members.length; i++) {
        expect(output.members[i].type).to.equal(Variable.Type.FLOAT)
      }
    })

    it('parses ivec2 declaration', function() {
      var input = 'ivec2 w'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.VECTOR)
      expect(output.name).to.equal('w')
      expect(output.members.length).to.equal(2)
      for (var i = 0; i < output.members.length; i++) {
        expect(output.members[i].type).to.equal(Variable.Type.INT)
      }
    })

    it('parses varying qualifier', function() {
      var input = 'varying vec4 point'
      var output = Parser.parseInstruction(input)
      expect(output.type).to.equal(Variable.Type.VECTOR)
      expect(output.name).to.equal('point')
      expect(output.members.length).to.equal(4)
      expect(output.qualifier).to.equal(Variable.Qualifier.VARYING)
    })
  })

  describe('splitBlocks', function() {
    it('does nothing when there are no blocks', function() {
      var input = 'hello\nworld'
      var output = Parser.splitBlocks(input)
      expect(output.length).to.equal(1)
      expect(output[0]).to.equal('hello\nworld')
    })

    it('parses a single block correctly', function() {
      var input = 'hello {\n' +
        'block\n' +
        '}\n' +
        'world'
      var output = Parser.splitBlocks(input)
      expect(output.length).to.equal(3)
      expect(output[0]).to.equal('hello')
      expect(output[1][0]).to.equal('block')
      expect(output[2]).to.equal('world')
    })

    it('parses nested blocks', function() {
      var input = 'hello {\n' +
        '    blocks {\n' +
        '        all {\n' +
        '            the {\n' +
        '                way {\n' +
        '                    down {\n' +
        '                    }\n' +
        '                }\n' +
        '            }\n' +
        '        }\n' +
        '    }\n' +
        '}\n' +
        'world'
      var output = Parser.splitBlocks(input)
      expect(output.length).to.equal(3)
      expect(output[0]).to.equal('hello')
      expect(output[2]).to.equal('world')
      var blocks = output[1]
      expect(blocks.length).to.equal(2)
      expect(blocks[0]).to.equal('blocks')
      var all = blocks[1]
      expect(all.length).to.equal(2)
      expect(all[0]).to.equal('all')
      var the = all[1]
      expect(the.length).to.equal(2)
      expect(the[0]).to.equal('the')
      var way = the[1]
      expect(way.length).to.equal(2)
      expect(way[0]).to.equal('way')
      var down = way[1]
      expect(down.length).to.equal(2)
      expect(down[0]).to.equal('down')
      expect(down[1].length).to.equal(0)
    })
  })
})