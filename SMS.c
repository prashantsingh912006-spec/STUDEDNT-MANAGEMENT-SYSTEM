#include<stdio.h>
#include<string.h>
# define MAX 100
struct Student{
    int roll;
    char name[100];
    char department[100];
    float marks;
};
int main(){
    struct Student students[MAX];
    int count = 0;
    int choice, roll, i, found;

    while(1){
        printf("\n == == == STUDENT MANAGEMENT SYSTEM == == == \n");
        printf("1.Add Student Record :\n");
        printf("2.Display all Students Record :\n");
        printf("3.Search Student Record :\n");
        printf("4.Update Student Record :\n");
        printf("5.Delete Student Record :\n");
        printf("6.Exit\n");
        
        printf("Enter Your Choice :");
        scanf("%d",&choice);

        // 1. Add Student

        if(choice == 1){
            if(count >= MAX){
                printf("Student list is full !\n");
                continue;
            }

            printf("\n Enter Roll Number :");
            scanf("%d",&students[count].roll);

            printf("\n Enter Name :");
            scanf("%s",&students[count].name);

            printf("\n Enter Department :");
            scanf("%s",&students[count].department);

            printf("\n Enter Marks :");
            scanf("%f",&students[count].marks);

            count ++;

            printf("\n Student Added Successfully !\n");
        }

        // 2. Display Student

        else if(choice == 2){
            if(count == 0){
                printf("\n No Student Record Available \n");
                continue;
            }
            printf("\n %-10s %-20s %-20s %-10s \n","roll","name","department","marks");
            printf("----------------------------------------------------------------\n");

            for(i=0; i<count; i++){
                printf("%-10d %-20s %-20s %-10.2f", students[i].roll,
                                                    students[i].name,
                                                    students[i].department,
                                                    students[i].marks
                        );
            }
        }

        // 3.Search Student
        
        else if(choice == 3){
            printf("\nEnter Roll Number to Search :");
            scanf("%d",&roll);
            found = 0;

            for(i=0; i<count; i++){
                if(students[i].roll == roll){
                    printf("\n Student Found !\n");
                    printf("Roll Number : %d \n",students[i].roll);
                    printf("Name : %s\n",students[i].name);
                    printf("Department : %s",students[i].department);
                    printf("Marks : %2.f\n",students[i].marks);

                    found = 1; 
                    break;
                }
            }

            if(found == 0){
                printf("\n Student Not Found !\n");
            }
        }

        // 4. Update Student

        else if(choice == 4){
            printf("\n Enter Your  Roll Number to Update :");
            scanf("%d",&roll);
            found = 0;
            for(i=0; i<count; i++){
                if(students[i].roll == roll){
                    printf("Enter New Name :");
                    scanf("%s",&students[i].name);

                    printf("Enter New Department :");
                    scanf("%s",&students[i].department);

                    printf("Enter New Marks :");
                    scanf("%f",&students[i].marks);

                    printf("\n Student Record Updated Successfully !\n");

                    found = 1;
                    break;
                }
            }
            if(found == 0){
                printf("\n Student not found !\n");
            }
        }

        // 5. Delete Student

        else if (choice == 5) {

            printf("\nEnter Roll Number to delete: ");
            scanf("%d", &roll);

            found = 0;

            for (i = 0; i < count; i++) {

                if (students[i].roll == roll) {

                    // Shift remaining records to the left
                    for (int j = i; j < count - 1; j++) {
                        students[j] = students[j + 1];
                    }

                    count--;

                    printf("\nStudent deleted successfully!\n");

                    found = 1;
                    break;
                }
            }

            if (found == 0) {
                printf("\nStudent not found!\n");
            }
        }

        // 6. Exit
        else if (choice == 6) {

            printf("\nProgram ended.\n");
            break;
        }

        else {
            printf("\nInvalid choice! Please try again.\n");
        }
         
    }
    return 0;
}