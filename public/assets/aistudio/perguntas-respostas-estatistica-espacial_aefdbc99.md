# Compêndio Exaustivo de Perguntas e Respostas: Estatística Espacial

Este documento reúne todas as questões de **Verdadeiro ou Falso** extraídas das provas de avaliação e exames das quatro Unidades de Aprendizagem (UC1, UC2, UC3 e UC4), com eliminação de repetições e fundamentação científica direta das fontes.

---

## 1. Unidade de Aprendizagem 1 (UC1): Conceitos Fundamentais, Tipos de Variáveis e ESDA

As questões desta unidade incidem sobre os princípios básicos da Geografia (1ª Lei de Tobler), tipologia de dados (variáveis contínuas vs. discretas), ferramentas de descrição espacial (histogramas, mapas de Voronoi, scatterplots) e estatísticas de autocorrelação espacial global e local (Global e Local Moran's I).

| # | Afirmação / Questão | Resposta | Justificação Académica / Conceito |
|---|---|---|---|
| **1** | A autocorrelação espacial quantifica um princípio básico da geografia: coisas que estão mais próximas são mais parecidas do que coisas mais distantes. | **Verdadeiro** | Traduz a Primeira Lei da Geografia de Tobler. |
| **2** | A autocorrelação espacial é a correlação de uma variável consigo mesma no espaço. | **Verdadeiro** | Mede a dependência espacial das observações na mesma variável. |
| **3** | A autocorrelação espacial depende das localizações dos dados, mas não dos valores dos atributos. | **Falso** | Depende simultaneamente das coordenadas espaciais e da semelhança dos valores numéricos. |
| **4** | Um fenómeno com elevado grau de autocorrelação espacial pode mudar abruptamente numa curta distância. | **Falso** | Elevada autocorrelação espacial implica variação suave e gradual no espaço. |
| **5** | O tempo que demora para chegar ao trabalho é uma variável discreta. | **Falso** | O tempo é uma variável contínua (pode assumir qualquer valor no continuum temporal). |
| **6** | A profundidade subaquática do lago (batimetria) é uma variável discreta. | **Falso** | A batimetria/profundidade é um campo espacial contínuo. |
| **7** | O som (medições em dB) é uma variável discreta. | **Falso** | O nível de pressão sonora (dB) é uma variável contínua. |
| **8** | A humidade é uma variável contínua. | **Verdadeiro** | Varia continuamente na atmosfera. |
| **9** | O peso dos indivíduos é uma variável contínua. | **Verdadeiro** | Medida física contínua. |
| **10** | O número de telemóveis por agregado familiar é uma variável discreta. | **Verdadeiro** | Contagem de números inteiros positivos (0, 1, 2, ...). |
| **11** | Pontos amostrais são locais onde coletamos dados sobre algum fenómeno e registamos as coordenadas espaciais. | **Verdadeiro** | Definição fundamental de dados pontuais georreferenciados. |
| **12** | Um atributo tem um comportamento isotrópico se a autocorrelação espacial não depende da direção. | **Verdadeiro** | A continuidade espacial é idêntica em todas as direções. |
| **13** | Um atributo tem um comportamento isotrópico se exibir uma tendência espacial. | **Falso** | A presença de tendência gera anisotropia (variação orientada segundo uma direção). |
| **14** | Um atributo tem um comportamento anisotrópico se a autocorrelação espacial depende da direção. | **Verdadeiro** | Definição de anisotropia. |
| **15** | Um atributo tem um comportamento anisotrópico apenas se exibir uma tendência espacial. | **Falso** | Pode haver anisotropia sem tendência global (ex.: variação estrutural direcionada). |
| **16** | Um atributo geográfico exibe um padrão de tendência quando os valores aumentam (ou diminuem) em alguma direção. | **Verdadeiro** | Gradiente espacial ordenado de variação. |
| **17** | O histograma é útil para identificar a ocorrência de valores extremos. | **Verdadeiro** | Mostra a distribuição de frequências e caudas da distribuição. |
| **18** | O histograma regional é útil para destacar a localização de valores extremos e outliers. | **Falso** | O histograma indica a *ocorrência* de valores, mas não a sua *localização geográfica*. |
| **19** | As ferramentas de descrição espacial são úteis para identificar a localização de valores extremos. | **Verdadeiro** | Mapas e gráficos espaciais mapeiam a posição dos pontos/polígonos. |
| **20** | As ferramentas de descrição espacial são úteis para identificar padrões anisotrópicos, em particular as direções de continuidade espacial. | **Verdadeiro** | Permitem visualizar orientações preferenciais de variação. |
| **21** | O histograma é útil para analisar o tipo e a força da relação entre duas variáveis. | **Falso** | O histograma é univariado. Para analisar duas variáveis usa-se o gráfico de dispersão. |
| **22** | O gráfico de dispersão (scatterplot) é útil para analisar o tipo e a força da relação entre as duas variáveis. | **Verdadeiro** | Permite visualizar a correlação e forma da relação bivariada. |
| **23** | A média pode ser muito afetada por valores extremos na cauda da distribuição (distribuições assimétricas). | **Verdadeiro** | A média não é uma medida robusta a outliers. |
| **24** | Um valor extremo é apenas um valor, portanto, pode não afetar muito a média (valor médio). | **Falso** | Um único outlier em amostragem reduzida desloca significativamente a média. |
| **25** | Num mapa simples de Voronoi (polígonos de Thiessen), áreas com polígonos pequenos indicam falta de amostras. | **Falso** | Polígonos pequenos indicam alta densidade de amostragem; polígonos grandes indicam falta de amostras. |
| **26** | Num mapa simples de Voronoi (polígonos de Thiessen), áreas com grandes polígonos indicam falta de amostras. | **Verdadeiro** | Quanto maior a área de influência de um ponto, mais isolado ele está. |
| **27** | Os mapas simples de Voronoi (polígonos de Thiessen) são úteis para identificar tendências espaciais. | **Verdadeiro** | A visualização da cor/valor do polígono em mapas de Voronoi expõe tendências de variação. |
| **28** | A estatística Global Moran's I mede a autocorrelação espacial com base apenas nos valores das amostras. | **Falso** | Requer a matriz de pesos espaciais (distância/contiguidade entre localizações) e os valores. |
| **29** | Um valor não significativo do Global Moran's I indica que o padrão de valores observado é aleatório. | **Verdadeiro** | Não se rejeita a hipótese nula de independência espacial (CSR). |
| **30** | A estatística Global Moran's I pode ser usada para avaliar a autocorrelação espacial de atributos discretos, como o número de pinheiros num parque. | **Verdadeiro** | Pode ser aplicada a contagens discretas agregadas por unidades espaciais. |
| **31** | Um valor positivo estatisticamente significativo da estatística Local Moran's I indica a localização de um cluster local. | **Verdadeiro** | Agrupamento de valores semelhantes (High-High ou Low-Low). |
| **32** | Um valor positivo estatisticamente significativo da estatística Local Moran's I indica a localização de um outlier local. | **Falso** | Indica um cluster local. Os outliers locais (High-Low / Low-High) têm Moran Local negativo. |
| **33** | Um valor negativo estatisticamente significativo da estatística Local Moran's I indica a localização de um outlier local. | **Verdadeiro** | Associação entre um valor diferente e a sua vizinhança. |
| **34** | Um valor negativo estatisticamente significativo da estatística Local Moran's I indica a localização de um cluster local. | **Falso** | Indica outlier local. |
| **35** | Uma feature (ponto ou polígono) faz parte de um cluster local quando possui features vizinhas com valores de atributo altos ou baixos semelhantes. | **Verdadeiro** | Definição de cluster espacial de valores semelhantes. |
| **36** | Quando valores semelhantes se agrupam num mapa há evidências de autocorrelação espacial local positiva. | **Verdadeiro** | Autocorrelação positiva significa semelhança espacial. |
| **37** | Quando valores semelhantes se agrupam num mapa há evidências de autocorrelação espacial local negativa. | **Falso** | Autocorrelação negativa significa dissemelhança espacial. |
| **38** | Quando valores diferentes se agrupam num mapa há evidências de autocorrelação espacial local positiva. | **Falso** | Trata-se de autocorrelação espacial negativa (outliers espaciais). |
| **39** | Um efeito proporcional é caracterizado por uma relação entre a média local e a variabilidade local. | **Verdadeiro** | Ocorre quando a variância cresce proporcionalmente com o nível médio. |
| **40** | Um efeito proporcional não tem impacto na precisão da interpolação espacial. | **Falso** | Provoca distorções na estimação da variância se não for corrigido. |

---

## 2. Unidade de Aprendizagem 2 (UC2): Interpolação Espacial Determinística e Avaliação de Erros

Esta unidade abrange a classificação dos métodos de interpolação em determinísticos vs. estocásticos, globais vs. locais, exatos vs. não exatos, bem como a utilização da validação cruzada e das métricas de erro (Mean Error, RMSE, MAE).

| # | Afirmação / Questão | Resposta | Justificação Académica / Conceito |
|---|---|---|---|
| **41** | A interpolação espacial é o processo de usar pontos com valores conhecidos para um atributo, para prever os valores do atributo em locais onde não há dados. | **Verdadeiro** | Definição concisa de interpolação espacial. |
| **42** | A interpolação espacial é o processo de criar uma superfície com base em valores localizados em pontos amostrados isolados. | **Verdadeiro** | Geração de superfícies contínuas a partir de amostras pontuais. |
| **43** | A interpolação espacial pode estimar o peso dos indivíduos em locais da cidade sem dados observados. | **Falso** | Atributos biológicos pessoais não formam um campo contínuo espacialmente autocorrelacionado. |
| **44** | A interpolação espacial pode estimar o número de telemóveis por família nas localizações das famílias sem dados registados. | **Falso** | Atributos socioeconómicos discretos individuais não são passíveis de interpolação contínua. |
| **45** | A interpolação espacial pode estimar o número de hambúrgueres de queijo consumidos por família nas localizações de famílias sem dados registados. | **Falso** | Variável estritamente discreta e sem continuidade de campo espacial. |
| **46** | Todos os interpoladores permitem estimar os valores de variáveis em localizações pontuais (ou instantes no tempo), pertencentes ao domínio da amostra da qual o modelo é derivado e para os quais não existem valores. | **Verdadeiro** | Propriedade comum a todos os algoritmos de interpolação espacial. |
| **47** | Os interpoladores determinísticos associam um valor único a cada localização. | **Verdadeiro** | Calculam uma estimativa pontual sem distribuição de probabilidade. |
| **48** | Os interpoladores determinísticos associam uma distribuição de probabilidade a cada localização. | **Falso** | Apenas os interpoladores estocásticos (como a Krigagem) associam uma distribuição de probabilidade. |
| **49** | Os interpoladores estocásticos associam uma distribuição de probabilidade a cada local. | **Verdadeiro** | Permitem calcular o valor previsto e a respetiva incerteza/variância. |
| **50** | Podem ser associadas incertezas às estimativas se for usado um interpolador determinístico. | **Falso** | Os métodos determinísticos não estimam a variância do erro. |
| **51** | Podem ser associadas incertezas às estimativas se for usado um interpolador estocástico. | **Verdadeiro** | A krigagem fornece a variância da estimativa. |
| **52** | Os interpoladores determinísticos têm em consideração a correlação espacial entre as observações. | **Falso** | Usam funções matemáticas pré-definidas (ex.: $1/d^p$), ignorando a autocorrelação real modelada por variograma. |
| **53** | Os interpoladores determinísticos são sempre interpoladores exatos. | **Falso** | Existem métodos determinísticos não exatos (ex.: superfícies de tendência ou splines com suavização). |
| **54** | O valor estimado por um interpolador exato é igual ao valor amostral observado para cada localização amostrada. | **Verdadeiro** | Honram rigorosamente as medições conhecidas nos pontos de amostragem. |
| **55** | A superfície prevista pelos interpoladores exatos não passa pelos valores dos dados. | **Falso** | Por definição de interpolador exato, a superfície passa exatamente sobre os pontos amostrais. |
| **56** | Os interpoladores globais preveem valores usando todos os valores amostrais. | **Verdadeiro** | O cálculo em qualquer ponto do espaço utiliza todas as amostras disponíveis da área de estudo. |
| **57** | Os interpoladores globais associam um valor determinístico a cada localização. | **Verdadeiro** | Exemplo: a Regressão por Superfície de Tendência (Trend Surface). |
| **58** | Os interpoladores globais associam uma distribuição de probabilidade a cada localização. | **Falso** | Interpolação global determinística gera um único valor. |
| **59** | Os interpoladores globais preveem valores a partir de amostras contidas em vizinhanças. | **Falso** | Usar vizinhanças de pesquisa é a característica definidora dos interpoladores *locais*. |
| **60** | Os interpoladores locais preveem valores a partir de amostras dentro de vizinhanças. | **Verdadeiro** | Selecionam apenas os pontos contidos na janela de busca local. |
| **61** | Os interpoladores locais associam um valor determinístico a cada localização. | **Verdadeiro** | Exemplo: IDW local. |
| **62** | Os interpoladores locais associam uma distribuição de probabilidade a cada localização. | **Falso** | Apenas estocásticos locais (Krigagem) fornecem probabilidades. |
| **63** | Os interpoladores locais são sempre interpoladores exatos. | **Falso** | Existem interpoladores locais não exatos. |
| **64** | A superfície prevista pelos interpoladores locais mostra apenas tendências gerais, filtrando os detalhes. | **Falso** | São os interpoladores *globais* que filtram detalhes e mostram tendências gerais. Os locais captam a variação de detalhe. |
| **65** | Os interpoladores determinísticos são sempre úteis porque, mesmo com dados esparsos, podem ser facilmente aplicados e fornecem uma primeira visão do padrão espacial do atributo na região de estudo. | **Verdadeiro** | São computacionalmente simples e servem de exploração inicial. |
| **66** | Os interpoladores determinísticos têm um bom desempenho quando o conjunto de dados tem amostras agrupadas. | **Falso** | Sofrem fortemente com o efeito de agrupamento (*clustering*), sobre-ponderando áreas densas. |
| **67** | Na interpolação por Inverse Distance Weighting (IDW), os valores observados mais próximos da localização a prever terão mais influência no valor previsto do que aqueles que estão mais distantes. | **Verdadeiro** | O peso é inversamente proporcional à distância. |
| **68** | O interpolador Inverse Distance Weighting (IDW) assume que cada ponto de entrada tem uma influência local que diminui com a distância. | **Verdadeiro** | Conceito fundamental do IDW. |
| **69** | O interpolador Inverse Distance Weighting (IDW) assume que cada ponto de entrada tem uma influência local que aumenta com a distância. | **Falso** | Violaria o princípio da dependência espacial. |
| **70** | Na interpolação por Inverse Distance Weighting (IDW), um parâmetro de potência mais alto coloca menos peso nos pontos mais próximos. | **Falso** | Uma potência ($p$) mais elevada atribui *ainda mais peso* aos pontos mais próximos, tornando a interpolação mais local. |
| **71** | O Inverse Distance Weighting (IDW), os Splines e os Polígonos de Thiessen são todos interpoladores determinísticos. | **Verdadeiro** | Todos se baseiam em fórmulas matemáticas sem modulação estocástica. |
| **72** | O Inverse Distance Weighting (IDW) é um interpolador estocástico. | **Falso** | É estritamente determinístico. |
| **73** | O interpolador Inverse Distance Weighting (IDW) é exato, local e determinístico. | **Verdadeiro** | Classificação completa correta do IDW. |
| **74** | O interpolador Inverse Distance Weighting (IDW) é exato, global e determinístico. | **Falso** | É local (usa vizinhança de pesquisa). |
| **75** | O interpolador Inverse Distance Weighting (IDW) é exato, local e estocástico. | **Falso** | Não é estocástico. |
| **76** | A interpolação é mais precisa se as amostras estiverem mais próximas da localização que está a ser estimada. | **Verdadeiro** | A incerteza aumenta com a distância a pontos amostrados. |
| **77** | A validação e validação cruzada permitem comparar o impacto de diferentes estratégias de modelação nos resultados. | **Verdadeiro** | Permite escolher os melhores parâmetros (ex.: potência no IDW ou modelo de variograma). |
| **78** | Uma desvantagem da validação cruzada é que ela é suscetível ao agrupamento de observações. | **Verdadeiro** | Se as amostras estiverem concentradas numa sub-região, as métricas de erro ficam enviesadas por essa área. |
| **79** | Uma vantagem da validação cruzada é que ela não é suscetível ao agrupamento de observações. | **Falso** | É afetada pela geometria e adensamento das amostras. |
| **80** | As estatísticas de erros de previsão obtidas por meio de validação ou validação cruzada são limitadas às localizações onde existem amostras. | **Verdadeiro** | O erro só pode ser calculado removendo temporariamente pontos amostrados conhecidos. |
| **81** | Os erros de previsão dependem da eficácia do modelo de interpolação e da distribuição espacial real (mas desconhecida) do fenómeno subjacente. | **Verdadeiro** | Reflete a interação entre o modelo e a realidade geográfica. |
| **82** | Idealmente, a distribuição dos erros de previsão é centrada em zero. | **Verdadeiro** | Significa que o modelo não é enviesado (erro médio $\approx 0$). |
| **83** | As estatísticas de erros de previsão denominadas Mean Error (Erro Médio) e Mean Absolute Error (Erro Absoluto Médio) permitem verificar se a estimação é enviesada. | **Verdadeiro** | O Mean Error (ME) mede a presença e direção do enviesamento. |
| **84** | As estatísticas de erros de previsão denominadas Mean Error (Erro Médio) e Mean Absolute Error (Erro Absoluto Médio) permitem verificar a precisão do modelo. | **Falso** | O Mean Error indica o *enviesamento* (viés); a *precisão* é medida pelo RMSE ou MAE. |
| **85** | A estatística de erros de previsão chamada Root Mean Square Error (RMSE) permite verificar a precisão do modelo. | **Verdadeiro** | O RMSE avalia a magnitude global da precisão/erros. |
| **86** | A estatística de erros de previsão chamada Root Mean Square Error (RMSE) permite verificar se a estimação é enviesada. | **Falso** | O RMSE eleva os erros ao quadrado, perdendo o sinal do viés; não serve para testar enviesamento. |

---

## 3. Unidade de Aprendizagem 3 (UC3): Geoestatística, Semivariograma e Métodos de Krigagem

Esta unidade foca-se na teoria das Variáveis Regionalizadas, modelação do semivariograma (nugget, sill, range), anisotropia (geométrica vs. zonal) e nas variantes de Krigagem (Simples, Ordinária e Universal).

| # | Afirmação / Questão | Resposta | Justificação Académica / Conceito |
|---|---|---|---|
| **87** | Kriging é um conjunto de técnicas geoestatísticas para interpolar o valor $Z(x_0)$ de um campo aleatório $Z(x)$. | **Verdadeiro** | Fundamento da teoria das variáveis regionalizadas. |
| **88** | Kriging é um conjunto de técnicas geoestatísticas para interpolar o valor $Z(x_0)$ de uma variável determinística $Z(x)$. | **Falso** | A krigagem pressupõe que o atributo é uma realização de um processo aleatório/estocástico. |
| **89** | Geralmente, os métodos de kriging são interpoladores exatos, locais e estocásticos. | **Verdadeiro** | Classificação completa dos métodos de Krigagem padrão. |
| **90** | Geralmente, os métodos de kriging são interpoladores exatos, globais e estocásticos. | **Falso** | Kriging opera com vizinhança de pesquisa local. |
| **91** | Os métodos de kriging são interpoladores determinísticos. | **Falso** | São métodos estocásticos. |
| **92** | A modelação geoestatística é baseada no princípio: pontos próximos no espaço tendem a ter valores menos semelhantes do que pontos mais distantes. | **Falso** | O princípio geoestatístico baseia-se na maior semelhança entre pontos próximos. |
| **93** | O método de interpolação chamado kriging requer que os dados recolhidos estejam correlacionados no espaço, e tiramos essa informação da análise do variograma. | **Verdadeiro** | A estrutura de dependência espacial modelada no variograma fornece os pesos de krigagem. |
| **94** | Os métodos de interpolação chamados kriging não requerem que os dados recolhidos sejam correlacionados no espaço. | **Falso** | Sem autocorrelação espacial, a krigagem reduz-se à média simples. |
| **95** | Uma das principais vantagens do kriging é que, assim que temos um modelo que caracteriza como a variável ocorre no espaço, o método pode usar essa informação específica para fins de interpolação. | **Verdadeiro** | Utiliza a função de variograma experimental ajustada. |
| **96** | O kriging é semelhante ao Inverse Distance Weighting no sentido em que pondera os valores medidos circundantes para derivar uma previsão para uma localização não medida. | **Verdadeiro** | Ambos são estimadores lineares ponderados. |
| **97** | Os métodos de Kriging e Inverse Distance Weighting são ambos interpoladores locais, pois utilizam uma vizinhança local para procurar as amostras que serão utilizadas na interpolação. | **Verdadeiro** | Ambas as técnicas restringem o cálculo aos vizinhos dentro da janela de busca. |
| **98** | Os métodos de Kriging e Inverse Distance Weighting são ambos interpoladores globais, pois utilizam todas as amostras disponíveis na interpolação de cada localização não amostrada. | **Falso** | Não utilizam a totalidade dos pontos do mapa se for definida vizinhança local. |
| **99** | O estimador de krigagem está matematicamente relacionado com a regressão linear. | **Verdadeiro** | É um estimador linear de variância mínima (BLUE). |
| **100** | O estimador de krigagem está matematicamente relacionado com a análise de clusters. | **Falso** | Não tem relação formal com algoritmos de agrupamento/clustering. |
| **101** | O estimador de krigagem é baseado na soma ponderada dos valores amostrados, de modo que os pesos atribuídos às amostras são calculados de forma a minimizar a variância de estimação sob a restrição do não enviesamento dos erros de estimação. | **Verdadeiro** | Definição do BLUE (Best Linear Unbiased Estimator). |
| **102** | Os pesos de krigagem associados aos valores amostrais são determinados de forma a que o estimador de krigagem seja não enviesado e tenha variância de estimação mínima. | **Verdadeiro** | Condição matemática do sistema de equações de Krigagem. |
| **103** | O interpolador de krigagem é um estimador enviesado. | **Falso** | É estritamente não enviesado ($\sum \lambda_i = 1$). |
| **104** | Os pesos da krigagem dependem do modelo do variograma. | **Verdadeiro** | As covariâncias entre amostras e ponto a prever derivam diretamente do variograma. |
| **105** | Ao contrário dos pesos associados aos valores amostrais do Inverse Distance Weighting, os pesos de krigagem têm um efeito de desagregação (declustering). | **Verdadeiro** | Reduzem o peso de pontos muito próximos entre si para evitar contaminação por sobreamostragem. |
| **106** | Os pesos de krigagem associados a valores observados mais próximos da localização a prever serão menores do que os pesos associados a valores mais distantes. | **Falso** | Salvo situações excecionais de blindagem (*screening effect*), amostras mais próximas recebem maior peso. |
| **107** | Pesos do Ordinary kriging são sempre positivos. | **Falso** | Devido ao efeito de desagregação e à restrição de Lagrange, podem surgir pesos ligeiramente negativos. |
| **108** | Definir uma grande vizinhança de pesquisa para selecionar mais amostras leva sempre a melhores previsões de krigagem. | **Falso** | Amostras além do patamar (*range*) adicionam apenas ruído e esforço computacional sem ganho de informação. |
| **109** | A variância de krigagem é a variância do erro minimizada. | **Verdadeiro** | Propriedade matemática da solução do sistema de krigagem. |
| **110** | A variância da krigagem é independente dos valores dos dados. | **Verdadeiro** | Depende unicamente do modelo de variograma e da geometria espacial das amostras, não dos valores medidos. |
| **111** | A variância da krigagem depende do modelo de covariância, mas não depende dos valores dos dados. | **Verdadeiro** | Reitera a independência entre os valores observados $Z(x_i)$ e o cálculo da variância de Krigagem. |
| **112** | A variância da krigagem não depende da geometria dos valores dos dados. | **Falso** | Depende criticamente da distribuição geométrica/espacial dos pontos de amostragem. |
| **113** | No Ordinary kriging, o mapa do prediction standard error não é um mapa de incerteza espacial, pois depende apenas do modelo do variograma e da geometria das amostras. | **Verdadeiro** | Como ignora a magnitude real dos valores $Z$, reflete apenas a configuração espacial do plano de amostragem. |
| **114** | No Ordinary kriging, o mapa do prediction standard error é um mapa de incerteza espacial. | **Falso** | Não mede incerteza do valor em si, mas sim a qualidade geométrica da cobertura amostral. |
| **115** | A Ordinary kriging assume estacionaridade dentro de vizinhanças locais. | **Verdadeiro** | Assume média constante mas desconhecida dentro da vizinhança de pesquisa. |
| **116** | Os interpoladores de kriging assumem que a média local é constante (estacionariedade local). | **Verdadeiro** | Pressuposto da Krigagem Ordinária. |
| **117** | No Simple kriging, a média é considerada conhecida e constante em toda a área de estudo. | **Verdadeiro** | Definição da Krigagem Simples. |
| **118** | No Simple kriging, a componente de tendência é modelada como uma combinação linear de funções das coordenadas espaciais. | **Falso** | Esta modelação de tendência através de coordenadas espaciais pertence ao *Universal Kriging*. |
| **119** | No Universal kriging, a média é considerada conhecida e constante em toda a área de estudo. | **Falso** | No Universal Kriging a média varia no espaço sob a forma de uma tendência polinomial. |
| **120** | No Universal kriging, a componente de tendência é modelada como uma combinação linear de funções das coordenadas espaciais. | **Verdadeiro** | Definição de Krigagem Universal. |
| **121** | A função que devolve a semivariância em função da distância entre os pontos chama-se semivariograma. | **Verdadeiro** | Conceito fundamental de Geoestatística $\gamma(h)$. |
| **122** | O semivariograma mede a variabilidade espacial entre os pontos em função da distância entre os pontos, portanto conforme a distância aumenta os valores do semivariograma aumentam. | **Verdadeiro** | A semivariância cresce com a distância até atingir o patamar. |
| **123** | O semivariograma mede a variabilidade espacial entre os pontos em função da distância entre os pontos, portanto conforme a distância aumenta os valores do semivariograma diminuem. | **Falso** | É o correlograma que diminui; o semivariograma aumenta. |
| **124** | Num variograma, o parâmetro patamar (sill) representa a variabilidade na ausência de correlação espacial. | **Verdadeiro** | Corresponde à variância a priori do processo quando deixa de haver autocorrelação. |
| **125** | Num variograma, o parâmetro patamar (sill) é a distância a partir da qual deixa de haver dependência espacial. | **Falso** | A *distância* é o alcance/amplitude (*range*); o *sill* é o valor do patamar no eixo Y. |
| **126** | Num variograma, o parâmetro de amplitude (range) é a distância a partir da qual a evidência de dependência espacial desaparece. | **Verdadeiro** | Limiar de distância da dependência espacial. |
| **127** | Em um variograma, o parâmetro de amplitude (range) representa a variabilidade na ausência de correlação espacial. | **Falso** | Troca as definições de *range* (distância) e *sill* (variância). |
| **128** | Se uma variável é espacialmente independente, esse comportamento pode ser identificado a partir do variograma desde que a malha de pontos seja suficientemente densa. | **Verdadeiro** | Revela um variograma plano (efeito pepita puro). |
| **129** | Um modelo de efeito pepita puro (pure nugget effect) corresponde à ausência total de autocorrelação espacial. | **Verdadeiro** | Variação puramente aleatória sem dependência à distância. |
| **130** | O efeito pepita (nugget effect) pode ser atribuído a erros de medição ou fontes espaciais de variação a distâncias menores do que o intervalo de amostragem, ou ambos. | **Verdadeiro** | Duas origens clássicas da descontinuidade na origem. |
| **131** | O efeito pepita (nugget effect) só ocorre quando há erros de medição. | **Falso** | Também ocorre por microvariabilidade não amostrada a distâncias inferiores ao lag mínimo. |
| **132** | O nugget representa pouca dispersão sobre distâncias curtas. | **Falso** | Representa grande variabilidade/descontinuidade instantânea a distâncias nulas ou muito curtas. |
| **133** | O nugget representa grande dispersão sobre distâncias curtas. | **Verdadeiro** | Mede a descontinuidade na origem. |
| **134** | O modelo de variograma Esférico apresenta um comportamento linear próximo da origem. | **Verdadeiro** | O modelo esférico inicia-se com inclinação linear junto à origem. |
| **135** | O modelo de variograma Exponencial apresenta um comportamento parabólico próximo da origem. | **Falso** | O modelo exponencial é linear na origem. É o modelo Gaussiano que apresenta comportamento parabólico. |
| **136** | Se o comportamento de dependência espacial da variável é uma função que depende da direção, diz-se que a variável regionalizada é anisotrópica. | **Verdadeiro** | Apresenta variogramas distintos consoante o azimute. |
| **137** | Se o comportamento de dependência espacial da variável é uma função que depende da direção, diz-se que a variável regionalizada é isotrópica. | **Falso** | É a definição de anisotropia. |
| **138** | Quando o atributo exibe anisotropia geométrica, os semivariogramas para duas direções perpendiculares têm valores de patamar (sill) diferentes. | **Falso** | Na anisotropia geométrica o patamar (*sill*) é **igual** em todas as direções; varia apenas a amplitude (*range*). Se o patamar diferir, é anisotropia zonal. |
| **139** | Quando o atributo é anisotrópico, os semivariogramas para duas direções perpendiculares têm a mesma função de modelo, o mesmo patamar (sill) e diferentes valores de amplitude (range). | **Verdadeiro** | Definição rigorosa de anisotropia geométrica. |
| **140** | A nuvem de pontos de um h-scatterplot torna-se mais ampla e mais difusa para valores menos semelhantes. | **Verdadeiro** | Afastamento da linha $x=y$ indica menor semelhança. |
| **141** | A nuvem de pontos de um h-scatterplot torna-se mais ampla e mais difusa para distâncias \|h\| maiores (lag). | **Verdadeiro** | À medida que a distância cresce, a correlação diminui e a dispersão aumenta. |
| **142** | A nuvem de pontos de um h-scatterplot irá mostrar pontos perto da linha x=y para maiores distâncias \|h\|. | **Falso** | Mostra pontos próximos de $x=y$ para distâncias $\|h\|$ *pequenas*, onde os valores são mais semelhantes. |
| **143** | O correlograma mede a correlação espacial entre os pontos em função da distância entre os pontos, portanto à medida que a distância aumenta os valores do correlograma diminuem. | **Verdadeiro** | A autocorrelação diminui com a distância. |
| **144** | O correlograma mede a correlação espacial entre os pontos em função da distância entre os pontos, portanto quando a distância aumenta os valores do correlograma aumentam. | **Falso** | A correlação não aumenta com a distância. |
| **145** | O correlograma diminui com o aumento da distância \|h\| numa direção específica. | **Verdadeiro** | Comportamento normal do correlograma direcional. |
| **146** | A interpolação tipicamente leva a uma sobrestimação de valores baixos e a uma subestimação dos elevados. Esse efeito de suavização aumenta com a diminuição da densidade de amostragem. | **Verdadeiro** | Efeito de suavização (*smoothing effect*) característico dos estimadores de variância mínima. |
| **147** | A interpolação tipicamente leva a uma sobrestimação de valores baixos e a uma subestimação dos elevados. Esse efeito de suavização aumenta com o aumento do efeito pepita relativo. | **Verdadeiro** | Maior ruído/pepita aumenta a suavização em direção à média. |
| **148** | A interpolação tipicamente leva a uma sobrestimação de valores baixos e uma subestimação dos elevados, mas esse efeito de suavização diminui com a diminuição da densidade de amostragem. | **Falso** | O efeito de suavização *aumenta* (não diminui) com a diminuição da densidade amostral. |
| **149** | A validação cruzada é uma ferramenta útil para avaliar a qualidade do ajustamento de um modelo de variograma. | **Verdadeiro** | Permite testar a adequação do modelo teórico de variograma aos dados reais. |

---

## 4. Unidade de Aprendizagem 4 (UC4): Regressão Espacial (OLS, GWR, MGWR) e Diagnósticos

Esta unidade foca-se na transição da regressão linear global (OLS) para a regressão espacial local (GWR e MGWR), na validação dos pressupostos clássicos (não-autocorrelação dos resíduos, homocedasticidade, ausência de multicolinearidade) e na seleção de larguras de banda (*bandwidths*).

| # | Afirmação / Questão | Resposta | Justificação Académica / Conceito |
|---|---|---|---|
| **150** | Os Mínimos Quadrados Ordinários (OLS) e a Regressão Geograficamente Ponderada (GWR) são usados para compreender ou prever relações lineares entre variáveis. | **Verdadeiro** | Ambos são modelos de especificação linear (global no OLS, local no GWR). |
| **151** | A Regressão Ponderada Geograficamente (GWR) é usada para compreender, ou prever, relações não lineares entre variáveis. | **Falso** | O GWR ajusta equações lineares em janelas locais; não é um modelo não linear. |
| **152** | Nos Mínimos Quadrados Ordinários (OLS), os parâmetros não podem variar no espaço. | **Verdadeiro** | OLS assume coeficientes constantes/estacionários para toda a área de estudo. |
| **153** | Nos Mínimos Quadrados Ordinários (OLS), os parâmetros podem variar no espaço. | **Falso** | O OLS é um modelo global rígido. |
| **154** | Na Regressão Geograficamente Ponderada (GWR), os parâmetros podem variar no espaço. | **Verdadeiro** | Permite modelar a não-estacionariedade espacial calculando um coeficiente por localização. |
| **155** | A Regressão Geograficamente Ponderada (GWR) permite que existam diferentes relações em diferentes pontos do espaço. | **Verdadeiro** | Essência da modelação estatística local. |
| **156** | A não estacionariedade espacial ocorre quando as relações entre as variáveis dependente e explicativas são inconsistentes em toda a área de estudo. | **Verdadeiro** | Exemplo: uma variável ter impacto positivo no Norte e nulo/negativo no Sul. |
| **157** | Nos Mínimos Quadrados Ordinários (OLS), os valores-p (p-values) das estatísticas t indicam se a variável explicativa correspondente é um preditor significativo da variável dependente. | **Verdadeiro** | Teste de hipótese para a significância individual de cada coeficiente $\beta_k$. |
| **158** | Uma das suposições mais importantes dos Mínimos Quadrados Ordinários (OLS) é que as observações devem ser independentes umas das outras, o que geralmente não é o caso para dados geográficos. | **Verdadeiro** | A autocorrelação espacial viola o pressuposto de independência dos erros no OLS. |
| **159** | Se o modelo de variograma dos resíduos não for um efeito pepita puro (pure nugget effect), então as observações não são independentes, o que viola uma suposição de mínimos quadrados ordinários (OLS). | **Verdadeiro** | Qualquer estrutura de variograma nos resíduos diferente de pepita puro indica autocorrelação espacial residual. |
| **160** | A independência dos valores dos resíduos pode ser testada usando a estatística Global Moran's I. | **Verdadeiro** | O Moran's I nos resíduos avalia se existe autocorrelação espacial dos erros. |
| **161** | A hipótese de variância constante dos resíduos pode ser testada por meio da estatística Global Moran's I. | **Falso** | A variância constante (homocedasticidade) é testada por Koenker (BP); Moran's I testa a *independência espacial*. |
| **162** | Nos Mínimos Quadrados Ordinários (OLS), a heterocedasticidade (variância não constante) dos resíduos tem sérias consequências para a interpretação dos resultados da regressão. | **Verdadeiro** | Invalida os erros-padrão e os testes $t$/$F$ de significância estatística. |
| **163** | Em Mínimos Quadrados Ordinários (OLS), a variância dos resíduos não é constante quando o fenómeno não é estacionário. | **Verdadeiro** | A não-estacionariedade espacial manifesta-se frequentemente sob a forma de heterocedasticidade no OLS. |
| **164** | Nos Mínimos Quadrados Ordinários (OLS), resíduos espacialmente autocorrelacionados levam a resultados de regressão não confiáveis. | **Verdadeiro** | Subestimam os erros-padrão e inflacionam falsamente a significância das variáveis. |
| **165** | Quando um modelo de regressão é especificado adequadamente, os resíduos são espacialmente aleatórios. | **Verdadeiro** | Requisito fundamental: resíduos sem padrão espacial (Moran's I não significativo). |
| **166** | Quando um modelo de regressão é especificado adequadamente, os resíduos agrupam-se espacialmente. | **Falso** | Se houver agrupamento espacial nos resíduos, o modelo está mal especificado (falta variável espacial). |
| **167** | Os resíduos da Regressão Geograficamente Ponderada (GWR) não devem apresentar autocorrelação espacial. | **Verdadeiro** | O GWR deve absorver a estrutura espacial, deixando resíduos aleatórios. |
| **168** | Os resíduos da Regressão Geograficamente Ponderada (GWR) devem apresentar autocorrelação espacial. | **Falso** | Se apresentarem autocorrelação, a largura de banda ou especificação do GWR falhou. |
| **169** | A estatística Global Moran's I deve ser usada para analisar os resíduos padronizados dos modelos de Regressão Geograficamente Ponderada. | **Verdadeiro** | Diagnóstico obrigatório para confirmar se os resíduos do GWR são aleatórios. |
| **170** | Os resíduos são a diferença entre os valores observados da variável de estudo (y) e os valores de y que são previstos com um modelo de regressão. | **Verdadeiro** | Definição formal de resíduo: $e_i = y_i - \hat{y}_i$. |
| **171** | Nos Mínimos Quadrados Ordinários (OLS), a multicolinearidade leva a resultados de regressão não confiáveis. | **Verdadeiro** | Provoca instabilidade nas estimativas dos coeficientes e inflaciona a variância. |
| **172** | O Variance Inflation Factor (VIF) de cada variável explicativa é utilizado para diagnosticar a possível existência de multicolinearidade. | **Verdadeiro** | Métrica padrão (valores de VIF > 5 ou 10 sinalizam multicolinearidade grave). |
| **173** | Nos Mínimos Quadrados Ordinários (OLS), as variáveis explicativas devem ser correlacionadas entre si. | **Falso** | As variáveis explicativas devem ser independentes entre si. |
| **174** | Na Regressão Geograficamente Ponderada (GWR), as variáveis explicativas devem ser correlacionadas entre si. | **Falso** | A multicolinearidade prejudica gravemente o GWR. |
| **175** | Se as variáveis explicativas estiverem correlacionadas entre si, então o modelo de Regressão Geograficamente Ponderada é apropriado. | **Falso** | A multicolinearidade reduz a estabilidade local dos coeficientes no GWR. |
| **176** | A multicolinearidade local é um problema grave na Regressão Geograficamente Ponderada porque pode enviesar os resultados. | **Verdadeiro** | Multicolinearidade local gera estimativas extremamente instáveis e inflacionadas no GWR. |
| **177** | A regressão ponderada geograficamente ajusta um kernel espacial aos dados (ou seja, requer uma matriz de pesos espaciais). | **Verdadeiro** | Utiliza funções de ponderação espacial (Gaussiana, Bisquadrada, etc.). |
| **178** | Na Regressão Geograficamente Ponderada, um modelo de regressão é ajustado dentro de uma janela de busca, dando maior peso aos pontos que estão mais próximos do que está no centro da janela. | **Verdadeiro** | Princípio de ponderação espacial por distância do GWR. |
| **179** | Na Regressão Geograficamente Ponderada, o uso de um kernel espacial fixo pode levar a estimativas imprecisas em áreas com poucos pontos de dados. | **Verdadeiro** | Em zonas de baixa densidade, o kernel fixo pode não conter observações suficientes para estimar os parâmetros. |
| **180** | Na Regressão Geograficamente Ponderada, o uso de um kernel espacial fixo pode levar a estimativas de parâmetros enviesadas em áreas com muitos pontos de dados. | **Verdadeiro** | Em zonas densas, um kernel fixo grande suaviza em excesso variações locais finas. |
| **181** | Onde os pontos de dados são densos, a Regressão Geograficamente Ponderada com um grande kernel espacial fixo pode não capturar relacionamentos em distâncias relativamente pequenas. | **Verdadeiro** | Larguras de banda excessivas perdem o detalhe micro-espacial. |
| **182** | Os kernels espaciais adaptativos têm larguras de banda (bandwidths) maiores em áreas com poucos pontos de dados, e larguras de banda menores em áreas com muitos pontos de dados. | **Verdadeiro** | Mantêm o número de vizinhos constante ajustando a distância geográfica. |
| **183** | Os kernels espaciais adaptativos têm larguras de banda maiores em áreas com muitos pontos de dados, e menores em áreas com poucos pontos de dados. | **Falso** | É exatamente o oposto. |
| **184** | Na Regressão Geograficamente Ponderada Multiescala (MGWR), cada variável explicativa pode ter a sua própria largura de banda (bandwidth). | **Verdadeiro** | Grande avanço do MGWR relativamente ao GWR tradicional. |
| **185** | A Regressão Geograficamente Ponderada é uma técnica que lida com a autocorrelação espacial. | **Falso** | O GWR lida com a *não-estacionariedade espacial* (variação local de parâmetros), e não diretamente com o efeito de lag espacial de autocorrelação. |
| **186** | Os testes estatísticos usados para diagnosticar o modelo de Mínimos Quadrados Ordinários (OLS) também podem ser usados para diagnosticar o modelo de Regressão Geograficamente Ponderada. | **Falso** | O GWR requer diagnósticos locais específicos (ex.: VIF local, AICc local, número efetivo de parâmetros). |
| **187** | O Critério de Informação de Akaike (AIC) pode auxiliar na seleção do melhor modelo de regressão, medindo a qualidade geral do ajustamento de cada modelo. | **Verdadeiro** | Permite comparar OLS vs. GWR vs. MGWR penalizando a complexidade. |
| **188** | O Critério de Informação de Akaike (AIC) é um teste estatístico usado para verificar a qualidade do ajustamento de cada modelo. | **Falso** | O AIC é uma medida de seleção de modelos e parcimónia, não um *teste estatístico de hipótese* (não gera valor-p). |
| **189** | O Coeficiente de Determinação (R-quadrado) mede a proporção da variabilidade no conjunto de dados que é explicada pelo modelo de regressão. | **Verdadeiro** | Medida clássica de goodness-of-fit ($R^2$). |
