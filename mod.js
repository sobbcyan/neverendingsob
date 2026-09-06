G.AddData({
	name:'NeverEnding Sobbing',
	author:'Sobb',
	desc:'Adds agriculture and farming.',
	engineVersion:1,
	manifest:0,

	func:function()
	{
		/*=====================================================================================
		AGRICULTURE RESOURCES
		=======================================================================================*/

		new G.Res({
			name:'seeds',
			desc:'Seeds saved from previous harvests. They can be planted to grow [grain].',
			icon:[4,10],
			partOf:'misc materials',
			category:'misc',
		});

		new G.Res({
			name:'grain',
			desc:'Grain harvested from cultivated fields. It is a reliable source of [food].',
			icon:[5,10],
			turnToByContext:{
				'eating':{
					'health':0.01,
					'happiness':0
				},
				'decay':{
					'spoiled food':1
				}
			},
			partOf:'food',
			category:'food',
		});

		new G.Res({
			name:'farmland',
			desc:'Cultivated land prepared for growing crops.',
			icon:[6,10],
			meta:true,
			displayUsed:true,
		});

		new G.Res({
			name:'agricultural tools',
			desc:'Specialized tools used for preparing soil and harvesting crops.',
			icon:[7,10],
			partOf:'gear',
			category:'gear',
			displayUsed:true,
		});


		/*=====================================================================================
		FARM
		=======================================================================================*/

		new G.Unit({
			name:'farm',
			desc:'@provides 2 [farmland]@uses [land]<>A cultivated plot of land where crops can be grown.',
			icon:[8,10],

			cost:{
				'archaic building materials':25
			},

			use:{
				'land':2
			},

			effects:[
				{
					type:'provide',
					what:{
						'farmland':2
					}
				},
				{
					type:'waste',
					chance:1/500
				}
			],

			req:{
				'agriculture':true
			},

			category:'production',
		});


		/*=====================================================================================
		FARMER
		=======================================================================================*/

		new G.Unit({
			name:'farmer',

			desc:'@cultivates [farmland] and produces [grain]@requires [seeds] to plant crops<>Farmers cultivate fields and save part of each harvest as seed for the next planting season.',

			icon:[9,10],

			cost:{},

			use:{
				'worker':1,
				'farmland':1
			},

			effects:[
				{
					type:'convert',
					from:{
						'seeds':1
					},
					into:{
						'grain':6,
						'seeds':1
					},
					every:10
				},

				{
					type:'mult',
					value:1.25,
					req:{
						'agricultural tools':true
					}
				},

				{
					type:'mult',
					value:1.5,
					req:{
						'irrigation':true
					}
				},

				{
					type:'mult',
					value:1.2,
					req:{
						'harvest rituals':'on'
					}
				}
			],

			req:{
				'agriculture':true
			},

			category:'production',
			priority:7,
		});


		/*=====================================================================================
		AGRICULTURAL WORKSHOP
		=======================================================================================*/

		new G.Unit({
			name:'agricultural workshop',

			desc:'@crafts [agricultural tools] from [stone tools] and [stick]s<>A simple workshop where farming implements are produced.',

			icon:[10,10],

			cost:{
				'archaic building materials':50
			},

			use:{
				'land':1
			},

			modes:{
				'off':G.MODE_OFF,

				'tools':{
					name:'Make agricultural tools',
					icon:[7,10],
					desc:'Turn [stone tools] and [stick]s into [agricultural tools].',
					use:{
						'worker':1,
						'stone tools':1
					}
				}
			},

			effects:[
				{
					type:'convert',
					from:{
						'stone tools':1,
						'stick':5
					},
					into:{
						'agricultural tools':1
					},
					every:10,
					mode:'tools'
				}
			],

			gizmos:true,

			req:{
				'agricultural tools':true
			},

			category:'crafting',
		});


		/*=====================================================================================
		IRRIGATION
		=======================================================================================*/

		new G.Unit({
			name:'irrigation canal',

			desc:'@provides 3 [farmland]@uses [land]<>A simple canal redirects water toward cultivated fields.',

			icon:[11,10],

			cost:{
				'mud':50,
				'stone':25
			},

			use:{
				'land':2
			},

			effects:[
				{
					type:'provide',
					what:{
						'farmland':3
					}
				},
				{
					type:'waste',
					chance:1/1000
				}
			],

			req:{
				'irrigation':true
			},

			category:'production',
		});


		/*=====================================================================================
		GRAIN STORE
		=======================================================================================*/

		new G.Unit({
			name:'grain store',

			desc:'@provides 1000 [food storage]@uses [land]<>A dedicated storehouse for keeping harvested grain dry and safe.',

			icon:[12,10],

			cost:{
				'basic building materials':75,
				'brick':25
			},

			use:{
				'land':2
			},

			effects:[
				{
					type:'provide',
					what:{
						'added food storage':1000
					}
				},
				{
					type:'waste',
					chance:1/1000
				}
			],

			req:{
				'crop storage':true
			},

			category:'storage',
		});


		/*=====================================================================================
		AGRICULTURE
		=======================================================================================*/

		new G.Tech({
			name:'agriculture',

			desc:'@unlocks [farm]s@unlocks [farmer]s@provides 20 [seeds]<>The deliberate cultivation of plants allows a tribe to produce food without relying entirely on wild plants.',

			icon:[8,1],

			cost:{
				'insight':25
			},

			req:{
				'sedentism':true,
				'digging':true,
				'plant lore':true
			},

			effects:[
				{
					type:'provide res',
					what:{
						'seeds':20
					}
				}
			],

			chance:2,
		});


		/*=====================================================================================
		AGRICULTURAL TOOLS
		=======================================================================================*/

		new G.Tech({
			name:'agricultural tools',

			desc:'@unlocks [agricultural workshop]s@improves [farmer] efficiency<>Specialized tools make preparing and harvesting fields easier.',

			icon:[7,1],

			cost:{
				'insight':20
			},

			req:{
				'agriculture':true,
				'tool-making':true
			},

			chance:2,
		});


		/*=====================================================================================
		IRRIGATION
		=======================================================================================*/

		new G.Tech({
			name:'irrigation',

			desc:'@unlocks [irrigation canal]s@improves [farmer] efficiency<>Canals and ditches allow farmers to bring water to cultivated fields.',

			icon:[11,1],

			cost:{
				'insight':30
			},

			req:{
				'agriculture':true,
				'well-digging':true
			},

			chance:2,
		});


		/*=====================================================================================
		CROP STORAGE
		=======================================================================================*/

		new G.Tech({
			name:'crop storage',

			desc:'@unlocks [grain store]s<>As farming becomes dependable, dedicated storage becomes necessary to carry food through poor harvests.',

			icon:[12,1],

			cost:{
				'insight':20
			},

			req:{
				'agriculture':true,
				'stockpiling':true,
				'pottery':true
			},

			chance:2,
		});


		/*=====================================================================================
		CROP ROTATION
		=======================================================================================*/

		new G.Tech({
			name:'crop rotation',

			desc:'@improves [farmer] efficiency<>Farmers learn that rotating crops can keep cultivated soil productive for longer.',

			icon:[13,1],

			cost:{
				'insight':35,
				'culture':5
			},

			req:{
				'agriculture':true,
				'crop storage':true
			},

			effects:[
				{
					type:'function',
					func:function()
					{
						var farmer=G.getDict('farmer');

						if (farmer)
						{
							farmer.effects.push({
								type:'mult',
								value:1.2
							});
						}
					}
				}
			],

			chance:1,
		});


		/*=====================================================================================
		FARMING TRADITION
		=======================================================================================*/

		new G.Trait({
			name:'farming tradition',

			desc:'@[farmer]s are 15% more efficient@A strong agricultural tradition is passed from one generation to the next.',

			icon:[14,1],

			cost:{
				'culture':5
			},

			chance:10,

			req:{
				'agriculture':true
			},

			effects:[
				{
					type:'mult',
					value:1.15
				}
			],
		});


		/*=====================================================================================
		SELECTIVE BREEDING
		=======================================================================================*/

		new G.Trait({
			name:'selective breeding',

			desc:'@[farmer]s are 20% more efficient@Careful selection of the strongest plants gradually improves crop yields.',

			icon:[15,1],

			cost:{
				'culture':10
			},

			chance:10,

			req:{
				'agriculture':true,
				'crop rotation':true
			},

			effects:[
				{
					type:'mult',
					value:1.2
				}
			],
		});
	}
});
