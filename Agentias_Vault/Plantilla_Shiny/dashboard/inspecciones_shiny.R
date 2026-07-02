library(shiny)
library(bslib)
library(plotly)
library(DT)

# Configuración del Tema Cactus Estético
cactus_theme <- bs_theme(
  version = 5,
  bootswatch = "minty",
  primary = "#2E7D32",     # Verde Cactus
  secondary = "#1F4E79",   # Azul Oscuro
  success = "#4CAF50",
  info = "#00ACC1",
  warning = "#FFB300",
  danger = "#C62828",
  base_font = font_google("Outfit"),
  heading_font = font_google("Outfit")
)

# Interfaz de Usuario (UI)
ui <- page_navbar(
  theme = cactus_theme,
  title = "Dashboard de Ejemplo: Análisis Científico",
  fillable = TRUE,
  
  nav_panel(
    title = "Visualización de Datos",
    icon = icon("chart-line"),
    layout_sidebar(
      sidebar = sidebar(
        title = "Controles de Gráficos",
        selectInput(
          inputId = "x_var",
          label = "Variable en Eje X:",
          choices = names(iris)[1:4],
          selected = names(iris)[1]
        ),
        selectInput(
          inputId = "y_var",
          label = "Variable en Eje Y:",
          choices = names(iris)[1:4],
          selected = names(iris)[2]
        ),
        selectInput(
          inputId = "color_var",
          label = "Agrupar por Especie:",
          choices = c("Sí" = "Species", "No" = "none"),
          selected = "Species"
        ),
        hr(),
        helpText("Este dashboard utiliza el dataset estándar 'iris' para demostrar la integración interactiva de R Shiny con gráficos dinámicos.")
      ),
      
      # Panel Principal
      card(
        card_header("Gráfico de Dispersión Interactivo"),
        plotlyOutput("scatter_plot")
      )
    )
  ),
  
  nav_panel(
    title = "Tabla de Datos",
    icon = icon("table"),
    card(
      card_header("Dataset Completo (Iris)"),
      DTOutput("data_table")
    )
  )
)

# Servidor (Server)
server <- function(input, output, session) {
  
  # Generar gráfico interactivo
  output$scatter_plot <- renderPlotly({
    p <- ggplot(iris, aes_string(x = input$x_var, y = input$y_var))
    
    if (input$color_var != "none") {
      p <- p + geom_point(aes(color = Species), size = 3, alpha = 0.8) +
        scale_color_manual(values = c("#2E7D32", "#1F4E79", "#FFB300"))
    } else {
      p <- p + geom_point(color = "#2E7D32", size = 3, alpha = 0.8)
    }
    
    p <- p + theme_minimal(base_family = "Arial") +
      labs(
        x = input$x_var,
        y = input$y_var
      )
    
    ggplotly(p) |> 
      layout(
        margin = list(l = 50, r = 30, t = 30, b = 50),
        legend = list(orientation = "h", y = -0.2)
      )
  })
  
  # Renderizar tabla
  output$data_table <- renderDT({
    datatable(
      iris,
      options = list(pageLength = 10, scrollX = TRUE),
      class = 'cell-border strip hover'
    )
  })
}

# Ejecutar la aplicación
shinyApp(ui = ui, server = server)