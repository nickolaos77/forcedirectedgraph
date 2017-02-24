'use strict'          
            fetch('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json')
                .then(function(response) { 
// Convert to JSON
	           return response.json();
               }).then(function(j) {//j is the returned JavaScript object 
                  const width =  1000;
   
                  const height = 700;
                  console.log(j.nodes);
                  const nodes = (j.nodes).slice(); //create the nodes array
                  const links = (j.links).slice(); //create the links array
                  const graph = {nodes,links};
        
                  const container = d3.select('body').select("#container")
                                
                  const svg = container.append("svg")
                                .attr("width",width)
                                .attr("height",height)
                
                  const link = svg.selectAll('.link')
                        .data(links)
                        .enter().append('line')
                        .attr('class', 'link'); 
                  
                const node =   container.select("#nodeContainer").selectAll('.node')
                        .data(nodes)
                        .enter().append( 'img')
                        .attr("class",d=>"absolute flag flag-"+d.code)
                        .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended))
                        .on("mouseover", (d)=>{
                           console.log(d); container.select("#nodeContainer").append('div').attr('id','tooltip').style('opacity','1').style('left', 30 + d.x +'px').style('top', d.y-20 + 'px').style('background-color','lightblue').style('position','absolute').html(d.country)
                        })
                        .on('mouseout', (d)=>{ 
                            document.getElementById('tooltip').remove();                 
                    });
                
//Force                
                  const simulation =  d3.forceSimulation()
                                        .force('link', d3.forceLink().distance(25))
                                        .force('charge', d3.forceManyBody().strength([4])) //gravity positive values=attraction, negative values = repulsion 
                                        .force('collide',d3.forceCollide([25]).iterations([10]) ) //how far are non connected nodes
                                        .force('center', d3.forceCenter(width / 2, (height / 2)  ));
                
                    simulation
                        .nodes(graph.nodes)
                        .on('tick', ticked);

                    simulation
                        .force('link')
                        .links(graph.links);


                    function ticked() {
                        link
                            .attr('x1', d => d.source.x)
                            .attr('y1', d => d.source.y )
                            .attr('x2', d => d.target.x)
                            .attr('y2', d => d.target.y);

                        node
                            .style('left', d => d.x + "px")
                            .style('top', d => d.y + "px" );
                    }

                    function dragstarted(d) {
                      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                      d.fx = d.x;
                      d.fy = d.y;
                    }

                    function dragged(d) {
                      d.fx = d3.event.x;
                      d.fy = d3.event.y;
                    }

                    function dragended(d) {
                      if (!d3.event.active) simulation.alphaTarget(0);
                      d.fx = null;
                      d.fy = null;
                    }

});
            